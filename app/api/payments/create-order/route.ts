import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bugId, amount } = await request.json();

    // Verify the bug exists and user is the author
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) {
      return NextResponse.json({ message: "Bug not found" }, { status: 404 });
    }

    if (bug.authorId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `bug_${bugId}_${Date.now()}`,
    });

    // Save payment record
    await prisma.payment.create({
      data: {
        razorpayOrderId: order.id,
        amount,
        bugId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
