import { NextResponse } from "next/server";
import db from "@/lib/db";

// 單筆
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT * FROM announcements WHERE id = ?",
      [numId]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 更新
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, content, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "UPDATE announcements SET title=?, content=?, status=? WHERE id=?",
      [title, content, status || "published", numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Update failed (找不到資料)" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 刪除
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "DELETE FROM announcements WHERE id=?",
      [numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Not found (沒刪到資料)" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
