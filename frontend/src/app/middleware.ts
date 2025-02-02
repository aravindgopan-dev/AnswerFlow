import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log(token)
  // ✅ If no token, redirect to login page
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware only to protected routes
export const config = {
  matcher: ["/faq/:path*"], // Only runs on /dashboard and its subroutes
};
