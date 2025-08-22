import { PaymentButton } from "@/components/payment-button";
import { PaymentDebug } from "@/components/payment-debug";

export default function PaymentTestPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Test Page</h1>
        <p className="text-gray-600">
          Use this page to test and debug payment functionality
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Button Test</h2>
          <div className="p-4 border rounded-lg">
            <PaymentButton
              bugId="test-bug-123"
              amount={500}
              onSuccess={() => console.log("Payment successful!")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configuration Debug</h2>
          <PaymentDebug />
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Troubleshooting Tips:
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>
            • Make sure you have a <code>.env.local</code> file with Razorpay
            keys
          </li>
          <li>
            • Check that <code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> is set
          </li>
          <li>
            • Verify <code>RAZORPAY_KEY_ID</code> and{" "}
            <code>RAZORPAY_KEY_SECRET</code> are set
          </li>
          <li>• Ensure you're signed in (authentication required)</li>
          <li>• Check browser console for any JavaScript errors</li>
        </ul>
      </div>
    </div>
  );
}
