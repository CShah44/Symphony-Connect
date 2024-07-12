// Clerk also has clerk loading and clerk loaded components to show their loading states as well

import Hero from "@/components/shared/Hero";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/feed");
  }

  return (
    <div>
      <Hero />
    </div>
  );
}
