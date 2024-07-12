import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// todo add public and private routes
const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/(.*)",
  "/api/uploadthing",
]);

// const adminRoutes = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (!publicRoutes(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
