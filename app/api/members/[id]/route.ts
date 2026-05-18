import { NextResponse } from "next/server";
import db from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

type MemberRow = RowDataPacket & {
  id?: number;
  name?: string | null;
  desc?: string | null;
  description?: string | null;
  img?: string | null;
  image_url?: string | null;
  link?: string | null;
  platform?: string | null;
  is_visible?: number | null;
  sort_order?: number | null;
};

type MemberBody = {
  name: string;
  desc: string;
  img: string;
  link?: string | null;
  platform?: string | null;
  is_visible?: number;
  sort_order?: number;
};

const normalizePlatform = (platform: unknown) =>
  platform === "twitter" || platform === "twitch" || platform === "youtube"
    ? platform
    : null;

const normalizeMember = (row: MemberRow) => ({
  id: row.id,
  name: row.name ?? "",
  desc: row.desc ?? row.description ?? "",
  img: row.img ?? row.image_url ?? "",
  link: row.link ?? null,
  platform: normalizePlatform(row.platform),
  is_visible: row.is_visible ?? 1,
  sort_order: row.sort_order ?? 0,
});

const getNumericId = async (context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const numericId = Number(id);

  return Number.isFinite(numericId) && numericId > 0 ? numericId : null;
};

/* ===== GET ===== */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const numericId = await getNumericId(context);

    if (!numericId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [rows] = await db.query<MemberRow[]>(
      `
      SELECT *
      FROM members
      WHERE id = ?
      LIMIT 1
      `,
      [numericId]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeMember(rows[0]));
  } catch (error: unknown) {
    console.error("GET member error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch member", detail },
      { status: 500 }
    );
  }
}

/* ===== PATCH ===== */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const numericId = await getNumericId(context);

    if (!numericId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = (await req.json()) as Partial<MemberBody>;

    const { name, desc, img, link, platform, is_visible, sort_order } = body;

    if (!name || !desc || !img) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const safePlatform = normalizePlatform(platform);
    const safeVisible = typeof is_visible === "number" ? is_visible : null;
    const safeOrder = typeof sort_order === "number" ? sort_order : null;

    const [result] = await db.query<ResultSetHeader>(
      `
      UPDATE members
      SET
        name = ?,
        \`desc\` = ?,
        img = ?,
        link = ?,
        platform = ?,
        is_visible = COALESCE(?, is_visible),
        sort_order = COALESCE(?, sort_order),
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
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      id: numericId,
    });
  } catch (error: unknown) {
    console.error("PATCH member error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to update member", detail },
      { status: 500 }
    );
  }
}

/* ===== DELETE ===== */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const numericId = await getNumericId(context);

    if (!numericId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [result] = await db.query<ResultSetHeader>(
      `
      DELETE FROM members
      WHERE id = ?
      `,
      [numericId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      id: numericId,
    });
  } catch (error: unknown) {
    console.error("DELETE member error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to delete member", detail },
      { status: 500 }
    );
  }
}
