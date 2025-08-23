"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"

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
  //   const { toast } = useToast()

  const handlePayment = async () => {
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
              //   toast({
              //     title: "Payment Successful",
              //     description: "Your bounty has been posted successfully!",
              //   })
              alert("Your bounty has been posted successfully!");
              onSuccess?.();
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(
                errorData.message || "Payment verification failed"
              );
            }
          } catch (error) {
            // toast({
            //   title: "Payment Verification Failed",
            //   description: "Please contact support",
            //   variant: "destructive",
            // })
            alert("Payment Verification Failed Please contact support");
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
      //   toast({
      //     title: "Payment Failed",
      //     description: "Unable to process payment. Please try again.",
      //     variant: "destructive",
      //   })
      // console.log(error)
      alert("Unable to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button onClick={handlePayment} disabled={isLoading}>
        <CreditCard className="w-4 h-4 mr-2" />
        {isLoading ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
      </Button>
    </>
  );
}
