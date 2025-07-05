import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validations";
import { sendBugSubmissionNotification } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bug = await prisma.bug.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!bug) {
      return NextResponse.json({ message: "Bug not found" }, { status: 404 });
    }

    if (bug.authorId === session.user.id) {
      return NextResponse.json(
        { message: "Cannot submit to your own bug" },
        { status: 400 }
      );
    }

    if (bug.status !== "OPEN") {
      return NextResponse.json(
        { message: "Bug is not open for submissions" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = submissionSchema.parse(body);

    const submission = await prisma.submission.create({
      data: {
        ...validatedData,
        bugId: id,
        submitterId: session.user.id,
      },
      include: {
        submitter: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send email notification to bug author
    if (bug.author.email) {
      try {
        await sendBugSubmissionNotification(
          bug.author.email,
          bug.title,
          submission.submitter.name || "Anonymous",
          id
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the submission if email fails
      }
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
