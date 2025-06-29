import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        reputation: true,
        _count: {
          select: {
            bugs: true,
            submissions: true,
          },
        },
        submissions: {
          where: {
            status: "APPROVED",
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        reputation: "desc",
      },
      take: 10,
    })

    const leaderboard = users.map((user:any) => ({
      ...user,
      approvedSubmissions: user.submissions.length,
      submissions: undefined, // Remove the submissions array from response
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
