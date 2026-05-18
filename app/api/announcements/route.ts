import { NextResponse } from "next/server";
import db from "@/lib/db"; // 你自己的 DB 連線

// 取得全部
export async function GET() {
  const [rows]: any = await db.query(
    "SELECT * FROM announcements ORDER BY id DESC"
  );
  return NextResponse.json(rows);
}

// 新增
export async function POST(req: Request) {
  const body = await req.json();
  const { title, content, status } = body;

  await db.query(
    "INSERT INTO announcements (title, content, status) VALUES (?, ?, ?)",
    [title, content, status || "published"]
  );

  return NextResponse.json({ success: true });
}
