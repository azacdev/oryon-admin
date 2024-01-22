import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('Origin')

  // @ts-ignore
  if (origin && allowedOrigins.includes(origin)) {
    const responseHeaders = new Headers()
    responseHeaders.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    responseHeaders.append('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    responseHeaders.append('Access-Control-Allow-Credentials', 'true')
    responseHeaders.append('Access-Control-Allow-Origin', origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: responseHeaders,
      })
    } else {
      const response = NextResponse.next({})
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Origin', origin)

      return response
    }
  }
}