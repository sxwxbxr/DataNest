import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/stats - Get dashboard statistics
export async function GET() {
  try {
    const [snippetCount, categoryCount, tagCount, aiQueryCount] =
      await Promise.all([
        prisma.snippet.count(),
        prisma.category.count(),
        prisma.tag.count(),
        prisma.aiQuery.count(),
      ]);

    const recentSnippets = await prisma.snippet.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const transformedSnippets = recentSnippets.map((snippet) => ({
      ...snippet,
      tags: snippet.tags.map((st) => st.tag),
    }));

    return NextResponse.json({
      stats: {
        snippets: snippetCount,
        categories: categoryCount,
        tags: tagCount,
        aiQueries: aiQueryCount,
      },
      recentSnippets: transformedSnippets,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
