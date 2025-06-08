import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/register"
  const token = request.cookies.get("user-token")?.value

  // Force authentication for all dashboard routes
  if (
    (path.startsWith("/dashboard") ||
      path.startsWith("/properties") ||
      path.startsWith("/tenants") ||
      path.startsWith("/leases") ||
      path.startsWith("/payments") ||
      path.startsWith("/search") ||
      path.startsWith("/profile") ||
      path.startsWith("/settings") ||
      path.startsWith("/online-transactions")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect root to dashboard if authenticated
  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect root to login if not authenticated
  if (path === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

