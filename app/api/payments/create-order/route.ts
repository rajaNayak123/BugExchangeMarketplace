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

    // Validate input
    if (!bugId || !amount || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid bug ID or amount" },
        { status: 400 }
      );
    }

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

    // Check if payment already exists for this bug
    const existingPayment = await prisma.payment.findFirst({
      where: { bugId, status: "COMPLETED" },
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already completed for this bug" },
        { status: 400 }
      );
    }

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay configuration missing");
      return NextResponse.json(
        { message: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency: "INR",
      receipt: `bug_${bugId.slice(-6)}_${Date.now().toString().slice(-6)}`,
    });

    console.log("Created Razorpay order:", order.id);

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

    // Handle specific Razorpay errors
    if (error instanceof Error) {
      if (error.message.includes("Invalid key")) {
        return NextResponse.json(
          { message: "Payment service configuration error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
