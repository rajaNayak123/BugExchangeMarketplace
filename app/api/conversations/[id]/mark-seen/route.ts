import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Check if user is participant in conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Mark all messages in this conversation as seen for the current user
    // This would typically involve updating a "seen" field on messages
    // For now, we'll just return success since we're using client-side simulation

    // In a real implementation, you might do something like:
    // await prisma.message.updateMany({
    //   where: {
    //     conversationId,
    //     senderId: { not: session.user.id }, // Only mark other users' messages as seen
    //   },
    //   data: {
    //     seenBy: { push: session.user.id }
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
