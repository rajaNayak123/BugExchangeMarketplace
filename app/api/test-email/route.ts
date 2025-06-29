import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendTestEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const result = await sendTestEmail(session.user.email)

    if (result.success) {
      return NextResponse.json({
        message: "Test email sent successfully",
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        {
          message: "Failed to send test email",
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
