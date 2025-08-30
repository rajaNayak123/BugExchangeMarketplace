import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { assignedToId, notes } = await request.json();

    // Check if bug exists
    const bug = await prisma.bug.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!bug) {
      return NextResponse.json({ message: "Bug not found" }, { status: 404 });
    }

    // Only bug author or assigned user can change assignment
    if (
      bug.authorId !== session.user.id &&
      bug.assignedToId !== session.user.id
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update bug assignment
    const updatedBug = await prisma.bug.update({
      where: { id },
      data: {
        assignedToId: assignedToId || null,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            reputation: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            image: true,
            reputation: true,
          },
        },
      },
    });

    // Create transition record
    if (bug.assignedToId !== assignedToId) {
      await prisma.bugTransition.create({
        data: {
          bugId: id,
          fromStatus: bug.status,
          toStatus: bug.status,
          assignedToId: assignedToId || null,
          notes:
            notes ||
            `Bug ${assignedToId ? "assigned to" : "unassigned from"} user`,
        },
      });
    }

    return NextResponse.json(updatedBug);
  } catch (error) {
    console.error("Error assigning bug:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
