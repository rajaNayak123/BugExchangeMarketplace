import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { bugSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const tags = searchParams.get("tags");
    const minBounty = searchParams.get("minBounty");
    const maxBounty = searchParams.get("maxBounty");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "newest";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(",");
      where.tags = { hasSome: tagArray };
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (minBounty || maxBounty) {
      where.bountyAmount = {};
      if (minBounty) where.bountyAmount.gte = Number(minBounty);
      if (maxBounty) where.bountyAmount.lte = Number(maxBounty);
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case "newest":
        orderBy.createdAt = sortOrder;
        break;
      case "oldest":
        orderBy.createdAt = sortOrder;
        break;
      case "highest-bounty":
        orderBy.bountyAmount = sortOrder;
        break;
      case "lowest-bounty":
        orderBy.bountyAmount = sortOrder;
        break;
      case "most-submissions":
        orderBy.submissions = { _count: sortOrder };
        break;
      case "least-submissions":
        orderBy.submissions = { _count: sortOrder };
        break;
      default:
        orderBy.createdAt = "desc";
    }

    // Get total count for pagination
    const totalCount = await prisma.bug.count({ where });
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

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
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      bugs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching bugs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bugSchema.parse(body);

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
    });

    return NextResponse.json(bug, { status: 201 });
  } catch (error) {
    console.error("Error creating bug:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
