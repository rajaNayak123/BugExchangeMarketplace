"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function EmailTest() {
  const [isLoading, setIsLoading] = useState(false);

  const sendTestEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert("Success: Test email sent successfully! Check your inbox.");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to send test email"}`);
      }
    } catch (error) {
      alert("Error: Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Email Configuration Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Test your email configuration by sending a test email to your account.
        </p>
        <Button onClick={sendTestEmail} disabled={isLoading}>
          <Mail className="w-4 h-4 mr-2" />
          {isLoading ? "Sending..." : "Send Test Email"}
        </Button>
      </CardContent>
    </Card>
  );
}
