import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_LIST } from "@/lib/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔥 放行 API（重點）
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 🔐 保護 admin
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("discord_token");

    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }

    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }

    const user = await res.json();

    if (!ADMIN_LIST.includes(user.id)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
