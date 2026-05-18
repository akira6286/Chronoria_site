import { NextResponse } from "next/server";
import db from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const DEFAULT_HERO_IMAGE = "/images/時序之境_B_單色_光暈.png";
const HERO_IMAGE_KEY = "hero_image";

type SettingRow = RowDataPacket & {
  value?: string | null;
};

type SettingsBody = {
  heroImage?: string;
};

const ensureSettingsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      \`key\` varchar(100) NOT NULL PRIMARY KEY,
      \`value\` text NOT NULL,
      updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export async function GET() {
  try {
    await ensureSettingsTable();

    const [rows] = await db.query<SettingRow[]>(
      `
      SELECT value
      FROM site_settings
      WHERE \`key\` = ?
      LIMIT 1
      `,
      [HERO_IMAGE_KEY]
    );

    return NextResponse.json({
      heroImage: rows[0]?.value || DEFAULT_HERO_IMAGE,
    });
  } catch (error: unknown) {
    console.error("GET site settings error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch site settings", detail },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureSettingsTable();

    const body = (await req.json()) as SettingsBody;
    const heroImage = body.heroImage?.trim();

    if (!heroImage) {
      return NextResponse.json(
        { error: "Missing hero image" },
        { status: 400 }
      );
    }

    if (heroImage.length > 500) {
      return NextResponse.json(
        { error: "Hero image path is too long" },
        { status: 400 }
      );
    }

    await db.query<ResultSetHeader>(
      `
      INSERT INTO site_settings (\`key\`, \`value\`, updated_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        \`value\` = VALUES(\`value\`),
        updated_at = NOW()
      `,
      [HERO_IMAGE_KEY, heroImage]
    );

    return NextResponse.json({
      success: true,
      heroImage,
    });
  } catch (error: unknown) {
    console.error("PATCH site settings error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to update site settings", detail },
      { status: 500 }
    );
  }
}
