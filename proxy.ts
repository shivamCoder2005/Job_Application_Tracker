// proxy.ts
// Next.js 16+ uses "proxy" instead of "middleware"

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/applications", "/add", "/interviews"];

export function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Check if path is protected
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Log path, method, and timestamp to console
  console.log(
    `[Proxy] ${request.method} ${pathname} at ${new Date().toISOString()}`
  );

  // Read job_tracker_session cookie
  const sessionCookie = request.cookies.get("job_tracker_session");

  if (!sessionCookie?.value) {
    // Redirect to /?error=login_required
    const redirectUrl = new URL("/?error=login_required", origin);
    return NextResponse.redirect(redirectUrl);
  }

  // Add X-Visited-At header to response
  const response = NextResponse.next();
  response.headers.set("X-Visited-At", new Date().toISOString());

  return response;
}

export default proxy;

export const config = {
  matcher: ["/applications/:path*", "/add/:path*", "/interviews/:path*"],
};
