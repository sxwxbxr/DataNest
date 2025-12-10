import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/settings - Get settings
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: "default" },
      });
    }

    // Don't expose the API key to the client
    return NextResponse.json({
      ...settings,
      aiApiKey: settings.aiApiKey ? "••••••••" : null,
      hasApiKey: !!settings.aiApiKey,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      aiProvider,
      aiApiKey,
      localModelEndpoint,
      theme,
      editorTheme,
      fontSize,
    } = body;

    const data: Record<string, unknown> = {};

    if (aiProvider !== undefined) data.aiProvider = aiProvider;
    if (aiApiKey !== undefined) data.aiApiKey = aiApiKey;
    if (localModelEndpoint !== undefined)
      data.localModelEndpoint = localModelEndpoint;
    if (theme !== undefined) data.theme = theme;
    if (editorTheme !== undefined) data.editorTheme = editorTheme;
    if (fontSize !== undefined) data.fontSize = fontSize;

    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        ...data,
      },
    });

    return NextResponse.json({
      ...settings,
      aiApiKey: settings.aiApiKey ? "••••••••" : null,
      hasApiKey: !!settings.aiApiKey,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
