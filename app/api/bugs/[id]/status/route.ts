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
    const { status, notes } = await request.json();

    // Check if bug exists
    const bug = await prisma.bug.findUnique({
      where: { id },
      include: { author: true, assignedTo: true },
    });

    if (!bug) {
      return NextResponse.json({ message: "Bug not found" }, { status: 404 });
    }

    // Only bug author, assigned user, or users with high reputation can change status
    const canChangeStatus =
      bug.authorId === session.user.id ||
      bug.assignedToId === session.user.id ||
      session.user.reputation >= 100; // High reputation users can change status

    if (!canChangeStatus) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update bug status
    const updatedBug = await prisma.bug.update({
      where: { id },
      data: { status },
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
    if (bug.status !== status) {
      await prisma.bugTransition.create({
        data: {
          bugId: id,
          fromStatus: bug.status,
          toStatus: status,
          assignedToId: bug.assignedToId,
          notes: notes || `Status changed from ${bug.status} to ${status}`,
        },
      });
    }

    return NextResponse.json(updatedBug);
  } catch (error) {
    console.error("Error updating bug status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
