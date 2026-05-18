import { NextResponse } from "next/server";

export async function GET() {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI!)}&scope=identify`;

  return NextResponse.redirect(url);
}
