import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CirclePlus, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full items-center justify-center my-[150px] font-agrandir">
      <SignedIn>
        {children}
        <Link href="/chat">
          <Button className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-4 bottom-24 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
            <MessageSquare size={28} strokeWidth={3} />
          </Button>
        </Link>
        <Link href="/create">
          <Button className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-4 bottom-4 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
            <CirclePlus size={28} strokeWidth={3} />
          </Button>
        </Link>
      </SignedIn>
      <SignedOut>
        Looks like you're not signed in! You'll be redirected to the login page.
      </SignedOut>
    </div>
  );
}
