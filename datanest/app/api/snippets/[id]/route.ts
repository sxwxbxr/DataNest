import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/snippets/[id] - Get a single snippet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...snippet,
      tags: snippet.tags.map((st) => st.tag),
    });
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}

// PUT /api/snippets/[id] - Update a snippet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, code, language, categoryId, tags } = body;

    // First, delete existing tag connections
    await prisma.snippetTag.deleteMany({
      where: { snippetId: id },
    });

    const snippet = await prisma.snippet.update({
      where: { id },
      data: {
        title,
        description,
        code,
        language,
        categoryId: categoryId || null,
        tags: tags?.length
          ? {
              create: tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...snippet,
      tags: snippet.tags.map((st) => st.tag),
    });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return NextResponse.json(
      { error: "Failed to update snippet" },
      { status: 500 }
    );
  }
}

// DELETE /api/snippets/[id] - Delete a snippet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.snippet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    );
  }
}
