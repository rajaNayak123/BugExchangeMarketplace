"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentButtonProps {
  bugId: string;
  amount: number;
  onSuccess?: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export function PaymentButton({
  bugId,
  amount,
  onSuccess,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error(
        "Failed to load payment gateway. Please refresh the page and try again."
      );
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      console.error("Razorpay key not found");
      toast.error("Payment configuration error. Please contact support.");
      return;
    }

    setIsLoading(true);
    try {
      // Create order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bugId, amount }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create order");
      }

      const {
        orderId,
        amount: orderAmount,
        currency,
      } = await orderResponse.json();

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderAmount,
        currency,
        name: "Bug Exchange",
        description: "Bug Bounty Payment",
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              toast.success("Payment successful! Your bounty has been posted.");
              onSuccess?.();
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(
                errorData.message || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(
              `Payment verification failed: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        },
        prefill: {
          name: "Bug Exchange User",
          email: "user@bugexchange.com",
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        `Payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading || !isRazorpayLoaded}>
      <CreditCard className="w-4 h-4 mr-2" />
      {isLoading
        ? "Processing..."
        : !isRazorpayLoaded
        ? "Loading..."
        : `Pay ₹${amount.toLocaleString()}`}
    </Button>
  );
}
