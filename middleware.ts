import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// todo add public and private routes
const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/(.*)",
]);

const adminRoutes = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (!publicRoutes(req)) auth().protect();

  const { sessionClaims }: any = auth();

  if (adminRoutes(req) && sessionClaims?.public_metadata.role !== "admin")
    auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
