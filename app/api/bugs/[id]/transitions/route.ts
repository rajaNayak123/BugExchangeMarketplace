import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if bug exists
    const bug = await prisma.bug.findUnique({
      where: { id },
    });

    if (!bug) {
      return NextResponse.json({ message: "Bug not found" }, { status: 404 });
    }

    // Fetch all transitions for this bug
    const transitions = await prisma.bugTransition.findMany({
      where: { bugId: id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(transitions);
  } catch (error) {
    console.error("Error fetching bug transitions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
