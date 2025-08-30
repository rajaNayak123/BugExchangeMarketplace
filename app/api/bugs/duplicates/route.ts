import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { title, description, tags, stackTrace } = await request.json();

    if (!title && !description && !tags && !stackTrace) {
      return NextResponse.json(
        { message: "At least one field is required for duplication detection" },
        { status: 400 }
      );
    }

    const where: any = {};

    // Search by title similarity
    if (title) {
      where.OR = [
        { title: { contains: title, mode: "insensitive" } },
        {
          title: {
            contains: title.split(" ").slice(0, 3).join(" "),
            mode: "insensitive",
          },
        },
      ];
    }

    // Search by description similarity
    if (description) {
      where.OR = [
        ...(where.OR || []),
        {
          description: {
            contains: description.split(" ").slice(0, 10).join(" "),
            mode: "insensitive",
          },
        },
      ];
    }

    // Search by tags
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Search by stack trace (if provided)
    if (stackTrace) {
      where.OR = [
        ...(where.OR || []),
        {
          stackTrace: {
            contains: stackTrace.split("\n")[0],
            mode: "insensitive",
          },
        },
      ];
    }

    const potentialDuplicates = await prisma.bug.findMany({
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
      take: 10,
    });

    // Calculate similarity scores
    const duplicatesWithScores = potentialDuplicates.map((bug) => {
      let score = 0;

      // Title similarity
      if (title && bug.title) {
        const titleWords = title.toLowerCase().split(" ");
        const bugTitleWords = bug.title.toLowerCase().split(" ");
        const commonWords = titleWords.filter((word: string) =>
          bugTitleWords.includes(word)
        );
        score +=
          (commonWords.length /
            Math.max(titleWords.length, bugTitleWords.length)) *
          40;
      }

      // Tag similarity
      if (tags && bug.tags) {
        const commonTags = tags.filter((tag: string) => bug.tags.includes(tag));
        score +=
          (commonTags.length / Math.max(tags.length, bug.tags.length)) * 30;
      }

      // Description similarity (basic keyword matching)
      if (description && bug.description) {
        const descWords = description.toLowerCase().split(" ");
        const bugDescWords = bug.description.toLowerCase().split(" ");
        const commonDescWords = descWords.filter((word: string) =>
          bugDescWords.includes(word)
        );
        score +=
          (commonDescWords.length /
            Math.max(descWords.length, bugDescWords.length)) *
          20;
      }

      // Stack trace similarity
      if (stackTrace && bug.stackTrace) {
        const stackLines = stackTrace.split("\n");
        const bugStackLines = bug.stackTrace.split("\n");
        const commonLines = stackLines.filter((line: string) =>
          bugStackLines.includes(line)
        );
        score +=
          (commonLines.length /
            Math.max(stackLines.length, bugStackLines.length)) *
          10;
      }

      return {
        ...bug,
        similarityScore: Math.round(score),
      };
    });

    // Sort by similarity score
    duplicatesWithScores.sort((a, b) => b.similarityScore - a.similarityScore);

    return NextResponse.json({
      duplicates: duplicatesWithScores.filter(
        (duplicate) => duplicate.similarityScore > 20
      ), // Only return relevant matches
    });
  } catch (error) {
    console.error("Error detecting duplicates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
