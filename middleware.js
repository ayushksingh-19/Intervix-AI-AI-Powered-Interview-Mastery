import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
]);

const authMiddleware = isClerkServerConfigured
  ? clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) auth().protect();
    })
  : null;

export default function middleware(req, event) {
  if (!authMiddleware) {
    return NextResponse.next();
  }

  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
