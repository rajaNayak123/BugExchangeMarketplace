import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/layout/providers";
import { ThemeProvider } from "@/components/theme/theme-provider";
import ErrorBoundary from "@/components/layout/error-boundary";
import { AuthRedirect } from "@/components/auth/auth-redirect";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ErrorBoundary>
              <AuthRedirect />
              <Navbar />
              <main>{children}</main>
            </ErrorBoundary>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
