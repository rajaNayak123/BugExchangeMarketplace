"use client"

import { PaymentButton } from "@/components/payment-button"

interface DashboardPaymentButtonProps {
  bugId: string
  amount: number
}

export function DashboardPaymentButton({ bugId, amount }: DashboardPaymentButtonProps) {
  const handlePaymentSuccess = () => {
    alert("Payment successful! Your bug bounty is now active.")
    window.location.reload()
  }

  return <PaymentButton bugId={bugId} amount={amount} onSuccess={handlePaymentSuccess} />
}
