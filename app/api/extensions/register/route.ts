import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { extensionId, extensionName, extensionVersion, platform } = body;

    if (!extensionId || !extensionName) {
      return NextResponse.json(
        { message: "Extension ID and name are required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would store this in a database
    // For now, we'll just log it and return success
    console.log("Extension registered:", {
      extensionId,
      extensionName,
      extensionVersion,
      platform,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Extension registered successfully",
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
        apiEndpoints: {
          reportBug: "/api/extensions/report-bug",
          getBugs: "/api/bugs",
          searchBugs: "/api/search/suggestions",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering extension:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

