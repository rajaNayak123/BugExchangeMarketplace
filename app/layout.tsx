import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import ErrorBoundary from "@/components/error-boundary";
import { AuthRedirect } from "@/components/auth-redirect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bug Exchange Marketplace",
  description:
    "A marketplace for developers to post bugs with bounties and earn by fixing them",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <AuthRedirect />
            <Navbar />
            <main>{children}</main>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
