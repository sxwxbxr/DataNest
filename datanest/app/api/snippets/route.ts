import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/snippets - Get all snippets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (language && language !== "all") {
      where.language = language;
    }

    if (category) {
      where.category = { name: category };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { name: tag },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { code: { contains: search } },
      ];
    }

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Transform tags to flat array
    const transformedSnippets = snippets.map((snippet) => ({
      ...snippet,
      tags: snippet.tags.map((st) => st.tag),
    }));

    return NextResponse.json(transformedSnippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

// POST /api/snippets - Create a new snippet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, code, language, categoryId, tags } = body;

    if (!title || !code || !language) {
      return NextResponse.json(
        { error: "Title, code, and language are required" },
        { status: 400 }
      );
    }

    const snippet = await prisma.snippet.create({
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
    console.error("Error creating snippet:", error);
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}
