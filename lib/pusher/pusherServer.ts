import PusherServer from "pusher";

// Allows you to use pusher inside Next.js route handlers and server
// components.
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: "ap2",
  useTLS: true,
});
