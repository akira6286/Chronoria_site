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
};

type MaxSortRow = RowDataPacket & {
  max: number;
};

type NewMemberBody = {
  name: string;
  desc: string;
  img: string;
  link?: string | null;
  platform?: string | null;
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
});

// ===== GET =====
export async function GET() {
  try {
    const [rows] = await db.query<MemberRow[]>(`
      SELECT *
      FROM members
      WHERE is_visible = 1
      ORDER BY sort_order ASC, id ASC
    `);

    const members = Array.isArray(rows) ? rows.map(normalizeMember) : [];

    return NextResponse.json(members);
  } catch (err) {
    console.error("GET members error:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// ===== POST =====
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<NewMemberBody>;
    const { name, desc, img, link, platform } = body;

    if (!name || !desc || !img) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const safePlatform =
      platform === "twitter" ||
      platform === "twitch" ||
      platform === "youtube"
        ? platform
        : null;

    const [maxRows] = await db.query<MaxSortRow[]>(`
      SELECT COALESCE(MAX(sort_order), 0) as max FROM members
    `);

    const nextOrder = (maxRows[0]?.max ?? 0) + 1;

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO members
      (name, \`desc\`, img, link, platform, sort_order, is_visible, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `,
      [
        name,
        desc,
        img.substring(0, 500),
        link || null,
        safePlatform,
        nextOrder,
      ]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
    });
  } catch (error: unknown) {
    console.error("POST member error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create member", detail },
      { status: 500 }
    );
  }
}
