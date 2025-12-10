import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/categories - Get all categories with snippet count
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { snippets: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const transformedCategories = categories.map((category) => ({
      ...category,
      snippetCount: category._count.snippets,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        color: color || "bg-blue-500",
      },
    });

    return NextResponse.json({ ...category, snippetCount: 0 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
