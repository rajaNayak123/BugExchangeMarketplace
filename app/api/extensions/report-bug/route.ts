import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bugSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the bug data
    const validatedData = bugSchema.parse({
      ...body,
      bountyAmount: Number.parseFloat(body.bountyAmount || "0"),
    });

    // Create the bug
    const bug = await prisma.bug.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
        // Set default values for required fields if not provided
        tags: validatedData.tags || [],
        category: validatedData.category || "FUNCTIONALITY",
        priority: validatedData.priority || "MEDIUM",
        severity: validatedData.severity || "MODERATE",
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        bug: {
          id: bug.id,
          title: bug.title,
          status: bug.status,
          url: `${process.env.NEXTAUTH_URL}/bugs/${bug.id}`,
        },
        message: "Bug reported successfully from extension",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error reporting bug from extension:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

