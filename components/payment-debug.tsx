"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkPaymentConfig = async () => {
    setIsLoading(true);
    try {
      // Check if Razorpay key is available
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // Test API endpoint
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bugId: "test-bug-id",
          amount: 100,
        }),
      });

      const data = await response.json();

      setDebugInfo({
        razorpayKeyConfigured: !!razorpayKey,
        razorpayKeyValue: razorpayKey ? "Configured" : "Not configured",
        apiResponse: data,
        apiStatus: response.status,
        apiOk: response.ok,
      });
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={checkPaymentConfig}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? "Checking..." : "Check Payment Config"}
        </Button>

        {debugInfo && (
          <div className="text-sm space-y-2">
            <h4 className="font-semibold">Debug Information:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
