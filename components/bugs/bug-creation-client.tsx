"use client";

import { PaymentButton } from "@/components/features/payment-button";
import { useRouter } from "next/navigation";

interface BugCreationPaymentButtonProps {
  bugId: string;
  amount: number;
}

export function BugCreationPaymentButton({
  bugId,
  amount,
}: BugCreationPaymentButtonProps) {
  const router = useRouter();

  const handlePaymentSuccess = () => {
    alert("Payment successful! Your bug bounty is now active.");
    router.push(`/bugs/${bugId}`);
  };

  return (
    <PaymentButton
      bugId={bugId}
      amount={amount}
      onSuccess={handlePaymentSuccess}
    />
  );
}
