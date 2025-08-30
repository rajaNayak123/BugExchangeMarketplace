import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  bugId: z.string().optional(),
  submissionId: z.string().optional(),
  parentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, bugId, submissionId, parentId } =
      commentSchema.parse(body);

    if (!bugId && !submissionId) {
      return NextResponse.json(
        { error: "Either bugId or submissionId is required" },
        { status: 400 }
      );
    }

    // Extract mentions from content (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    // Find mentioned users
    const mentionedUsers = await prisma.user.findMany({
      where: {
        name: { in: mentions },
      },
      select: { id: true, name: true },
    });

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        bugId,
        submissionId,
        parentId,
        mentions: mentionedUsers.map((u) => u.id),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Create notifications for mentioned users
    if (mentionedUsers.length > 0) {
      await prisma.notification.createMany({
        data: mentionedUsers.map((user) => ({
          userId: user.id,
          type: "MENTION",
          title: "You were mentioned",
          message: `${session.user.name} mentioned you in a comment`,
          data: JSON.stringify({ commentId: comment.id, bugId, submissionId }),
        })),
      });
    }

    // Create notification for bug/submission owner
    if (bugId) {
      const bug = await prisma.bug.findUnique({
        where: { id: bugId },
        select: { authorId: true, title: true },
      });

      if (bug && bug.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: bug.authorId,
            type: "COMMENT",
            title: "New comment on your bug",
            message: `${session.user.name} commented on "${bug.title}"`,
            data: JSON.stringify({ commentId: comment.id, bugId }),
          },
        });
      }
    }

    if (submissionId) {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        select: { submitterId: true, bugId: true },
      });

      if (submission && submission.submitterId !== session.user.id) {
        const bug = await prisma.bug.findUnique({
          where: { id: submission.bugId },
          select: { title: true },
        });

        await prisma.notification.create({
          data: {
            userId: submission.submitterId,
            type: "COMMENT",
            title: "New comment on your submission",
            message: `${session.user.name} commented on your submission for "${bug?.title}"`,
            data: JSON.stringify({ commentId: comment.id, submissionId }),
          },
        });
      }
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bugId = searchParams.get("bugId");
    const submissionId = searchParams.get("submissionId");

    if (!bugId && !submissionId) {
      return NextResponse.json(
        { error: "Either bugId or submissionId is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        OR: [{ bugId }, { submissionId }],
        parentId: null, // Only get top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
