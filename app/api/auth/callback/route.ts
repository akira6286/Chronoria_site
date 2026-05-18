import { NextResponse } from "next/server";
import { ADMIN_LIST } from "@/lib/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    console.log("❌ 沒有 code");
    return NextResponse.redirect("https://chronoria.leetcord.org");
  }

  // 1️⃣ 換 access token
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
  });

  const data = await res.json();

  // ❗ token 拿不到
  if (!data.access_token) {
    console.log("❌ 沒拿到 access_token");
    return NextResponse.redirect("https://chronoria.leetcord.org");
  }

  // 2️⃣ 拿 Discord 使用者
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  const user = await userRes.json();

  console.log("👤 登入使用者:", user.id);
  console.log("📋 ADMIN_LIST:", ADMIN_LIST);

  // ❗ user.id 不存在
  if (!user.id) {
    console.log("❌ user.id 不存在");
    return NextResponse.redirect("http://localhost");
  }

  // 3️⃣ 白名單判斷
  if (!ADMIN_LIST.includes(user.id)) {
    console.log("🚫 不在白名單:", user.id);
    return NextResponse.redirect("http://localhost");
  }

  console.log("✅ 通過白名單:", user.id);

  // 4️⃣ 通過 → 進 admin
  const response = NextResponse.redirect(
    "https://chronoria.leetcord.org/admin"
  );

  // 5️⃣ 存 token（給 middleware 用）
  response.cookies.set("discord_token", data.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
