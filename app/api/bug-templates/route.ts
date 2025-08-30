import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const where: any = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const templates = await prisma.bugTemplate.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching bug templates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
