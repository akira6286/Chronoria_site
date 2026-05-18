import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // ✅ 刪正確的 cookie
  res.cookies.set("discord_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res;
}
