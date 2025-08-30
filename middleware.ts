import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (req.nextUrl.pathname.startsWith("/auth") && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is not authenticated and trying to access protected pages, redirect to signin
    if (
      (req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/profile") ||
        req.nextUrl.pathname.startsWith("/bugs/new")) &&
      !req.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/bugs") ||
          req.nextUrl.pathname.startsWith("/api")
        ) {
          return true;
        }

        // Require authentication for protected routes
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/profile") ||
          req.nextUrl.pathname.startsWith("/bugs/new")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
