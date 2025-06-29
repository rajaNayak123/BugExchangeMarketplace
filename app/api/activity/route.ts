import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get recent bugs posted
    const recentBugs = await prisma.bug.findMany({
      select: {
        id: true,
        title: true,
        bountyAmount: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    // Get recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        submitter: {
          select: {
            name: true,
            image: true,
          },
        },
        bug: {
          select: {
            id: true,
            title: true,
            bountyAmount: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    // Format activities with proper typing
    const bugActivities = recentBugs.map((bug) => ({
      id: `bug_${bug.id}`,
      type: "bug_posted",
      createdAt: bug.createdAt.toISOString(),
      user: bug.author,
      bug: {
        id: bug.id,
        title: bug.title,
        bountyAmount: bug.bountyAmount,
      },
    }))

    const submissionActivities = recentSubmissions.map((submission) => ({
      id: `submission_${submission.id}`,
      type: submission.status === "APPROVED" ? "submission_approved" : "submission_made",
      createdAt: submission.createdAt.toISOString(),
      user: submission.submitter,
      bug: submission.bug,
    }))

    // Combine all activities
    const activities = [...bugActivities, ...submissionActivities]

    // Sort by date and take latest 10
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(activities.slice(0, 10))
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
