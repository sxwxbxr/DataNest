import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/tags - Get all tags with snippet count
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { snippets: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const transformedTags = tags.map((tag) => ({
      ...tag,
      snippetCount: tag._count.snippets,
    }));

    return NextResponse.json(transformedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Normalize tag name (lowercase, replace spaces with hyphens)
    const normalizedName = name.toLowerCase().trim().replace(/\s+/g, "-");

    const tag = await prisma.tag.create({
      data: {
        name: normalizedName,
        color: color || "bg-blue-500",
      },
    });

    return NextResponse.json({ ...tag, snippetCount: 0 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/tags - Bulk delete tags
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Tag IDs are required" },
        { status: 400 }
      );
    }

    await prisma.tag.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tags:", error);
    return NextResponse.json(
      { error: "Failed to delete tags" },
      { status: 500 }
    );
  }
}
