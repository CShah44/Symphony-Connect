import { clerkMiddleware } from "@clerk/nextjs/server";

// todo add public and private routes

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
