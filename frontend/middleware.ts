import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/account", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // Check for auth token in cookies (as a basic server-side check)
    // The actual auth validation happens client-side in AuthContext
    // Checkout allows guest users, so we skip it
    if (pathname.startsWith("/checkout")) {
      return NextResponse.next();
    }

    // For account pages, we rely on client-side redirect in the layout
    // This middleware just ensures the page loads
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
};
