import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Missing payment verification data" },
        { status: 400 }
      );
    }

    // Validate Razorpay secret
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay secret not configured");
      return NextResponse.json(
        { message: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid payment signature");
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Find and update payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment record not found" },
        { status: 404 }
      );
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json(
        { message: "Payment already verified" },
        { status: 400 }
      );
    }

    // Update payment record
    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "COMPLETED",
      },
    });

    console.log("Payment verified successfully:", razorpay_order_id);

    return NextResponse.json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
