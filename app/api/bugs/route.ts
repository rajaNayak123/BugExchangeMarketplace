import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { bugSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const tags = searchParams.get("tags")?.split(",")
    const minBounty = searchParams.get("minBounty")
    const maxBounty = searchParams.get("maxBounty")

    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    if (minBounty || maxBounty) {
      where.bountyAmount = {}
      if (minBounty) where.bountyAmount.gte = Number.parseFloat(minBounty)
      if (maxBounty) where.bountyAmount.lte = Number.parseFloat(maxBounty)
    }

    const bugs = await prisma.bug.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            image: true,
            reputation: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(bugs)
  } catch (error) {
    console.error("Error fetching bugs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bugSchema.parse(body)

    const bug = await prisma.bug.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            reputation: true,
          },
        },
      },
    })

    return NextResponse.json(bug, { status: 201 })
  } catch (error) {
    console.error("Error creating bug:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
