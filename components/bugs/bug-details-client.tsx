"use client";

import { PaymentButton } from "@/components/features/payment-button";

interface BugDetailsPaymentButtonProps {
  bugId: string;
  amount: number;
}

export function BugDetailsPaymentButton({
  bugId,
  amount,
}: BugDetailsPaymentButtonProps) {
  const handlePaymentSuccess = () => {
    alert("Payment successful! Your bug bounty has been posted.");
    window.location.reload();
  };

  return (
    <PaymentButton
      bugId={bugId}
      amount={amount}
      onSuccess={handlePaymentSuccess}
    />
  );
}
