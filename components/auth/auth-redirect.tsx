"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is authenticated and on the home page, redirect to dashboard
    if (status === "authenticated" && session && pathname === "/") {
      router.replace("/dashboard");
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (status === "authenticated" && session && pathname.startsWith("/auth")) {
      router.replace("/dashboard");
    }
  }, [session, status, pathname, router]);

  // Don't render anything, this is just for side effects
  return null;
}
