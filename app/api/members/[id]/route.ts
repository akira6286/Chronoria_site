import { NextResponse } from "next/server";
import db from "@/lib/db";

/* ===== PATCH：編輯成員 ===== */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!numericId || isNaN(numericId)) {
      return NextResponse.json(
        { error: "無效的 ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      name,
      desc,
      img,
      link,
      platform,
      is_visible,
      sort_order,
    } = body;

    if (!name || !desc || !img) {
      return NextResponse.json(
        { error: "缺少必要欄位" },
        { status: 400 }
      );
    }

    const safePlatform =
      platform === "twitter" ||
      platform === "twitch" ||
      platform === "youtube"
        ? platform
        : null;

    const safeVisible =
      typeof is_visible === "number"
        ? is_visible
        : 1;

    const safeOrder =
      typeof sort_order === "number"
        ? sort_order
        : 0;

    const [result]: any = await db.query(
      `
      UPDATE members
      SET
        name = ?,
        \`desc\` = ?,
        img = ?,
        link = ?,
        platform = ?,
        is_visible = ?,
        sort_order = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        name,
        desc,
        img.substring(0, 500),
        link ? link.substring(0, 500) : null,
        safePlatform,
        safeVisible,
        safeOrder,
        numericId,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "找不到該成員" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: numericId,
    });

  } catch (error: any) {
    console.error("PATCH member error:", error);

    return NextResponse.json(
      { error: "更新失敗", detail: error.message },
      { status: 500 }
    );
  }
}

/* ===== DELETE：刪除成員 ===== */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!numericId || isNaN(numericId)) {
      return NextResponse.json(
        { error: "無效的 ID" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      DELETE FROM members
      WHERE id = ?
      `,
      [numericId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "找不到該成員" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: numericId,
    });

  } catch (error: any) {
    console.error("DELETE member error:", error);

    return NextResponse.json(
      { error: "刪除失敗", detail: error.message },
      { status: 500 }
    );
  }
}
