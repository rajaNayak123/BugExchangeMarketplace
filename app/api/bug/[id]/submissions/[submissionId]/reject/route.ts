import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendSubmissionRejectedNotification } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string; submissionId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const bug = await prisma.bug.findUnique({
      where: { id: params.id },
      include: {
        submissions: {
          where: { id: params.submissionId },
          include: {
            submitter: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!bug) {
      return NextResponse.json({ message: "Bug not found" }, { status: 404 })
    }

    if (bug.authorId !== session.user.id) {
      return NextResponse.json({ message: "Only bug author can reject submissions" }, { status: 403 })
    }

    const submission = bug.submissions[0]
    if (!submission) {
      return NextResponse.json({ message: "Submission not found" }, { status: 404 })
    }

    await prisma.submission.update({
      where: { id: params.submissionId },
      data: { status: "REJECTED" },
    })

    // Send email notification to submitter
    try {
      await sendSubmissionRejectedNotification(
        submission.submitter.email,
        bug.title,
        submission.submitter.name || "Developer",
      )
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the rejection if email fails
    }

    return NextResponse.json({ message: "Submission rejected successfully" })
  } catch (error) {
    console.error("Error rejecting submission:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
