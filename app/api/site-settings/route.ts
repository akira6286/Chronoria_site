import { NextResponse } from "next/server";
import db from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const HERO_BACKGROUND_IMAGE_KEY = "hero_background_image";
const HERO_LOGO_IMAGE_KEY = "hero_logo_image";

type SettingRow = RowDataPacket & {
  key: string;
  value?: string | null;
};

type SettingsBody = {
  heroBackgroundImage?: string;
  heroLogoImage?: string;
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
      SELECT \`key\`, value
      FROM site_settings
      WHERE \`key\` IN (?, ?)
      `,
      [HERO_BACKGROUND_IMAGE_KEY, HERO_LOGO_IMAGE_KEY]
    );
    const settings = new Map(rows.map((row) => [row.key, row.value ?? ""]));

    return NextResponse.json({
      heroBackgroundImage: settings.get(HERO_BACKGROUND_IMAGE_KEY) || "",
      heroLogoImage: settings.get(HERO_LOGO_IMAGE_KEY) || "",
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
    const heroBackgroundImage = body.heroBackgroundImage?.trim();
    const heroLogoImage = body.heroLogoImage?.trim();

    if (heroBackgroundImage && heroBackgroundImage.length > 500) {
      return NextResponse.json(
        { error: "Hero background image path is too long" },
        { status: 400 }
      );
    }

    if (heroLogoImage && heroLogoImage.length > 500) {
      return NextResponse.json(
        { error: "Hero logo image path is too long" },
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
      [HERO_BACKGROUND_IMAGE_KEY, heroBackgroundImage ?? ""]
    );
    await db.query<ResultSetHeader>(
      `
      INSERT INTO site_settings (\`key\`, \`value\`, updated_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        \`value\` = VALUES(\`value\`),
        updated_at = NOW()
      `,
      [HERO_LOGO_IMAGE_KEY, heroLogoImage ?? ""]
    );

    return NextResponse.json({
      success: true,
      heroBackgroundImage: heroBackgroundImage ?? "",
      heroLogoImage: heroLogoImage ?? "",
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
