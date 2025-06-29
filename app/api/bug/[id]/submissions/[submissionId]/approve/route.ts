import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendSubmissionApprovedNotification } from "@/lib/email"

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
      return NextResponse.json({ message: "Only bug author can approve submissions" }, { status: 403 })
    }

    const submission = bug.submissions[0]
    if (!submission) {
      return NextResponse.json({ message: "Submission not found" }, { status: 404 })
    }

    // Update submission status and bug status
    await prisma.$transaction([
      prisma.submission.update({
        where: { id: params.submissionId },
        data: { status: "APPROVED" },
      }),
      prisma.bug.update({
        where: { id: params.id },
        data: { status: "RESOLVED" },
      }),
      // Increase submitter's reputation
      prisma.user.update({
        where: { id: submission.submitterId },
        data: {
          reputation: {
            increment: Math.floor(bug.bountyAmount / 100), // 1 rep per ₹100
          },
        },
      }),
    ])

    // Send email notification to submitter
    try {
      await sendSubmissionApprovedNotification(
        submission.submitter.email,
        bug.title,
        bug.bountyAmount,
        submission.submitter.name || "Developer",
      )
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the approval if email fails
    }

    return NextResponse.json({ message: "Submission approved successfully" })
  } catch (error) {
    console.error("Error approving submission:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
