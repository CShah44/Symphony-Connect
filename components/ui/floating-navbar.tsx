"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const FloatingNav = ({ className }: { className?: string }) => {
  const { user } = useUser();

  const navItems = [
    {
      name: "Feed",
      link: "/feed",
    },
    {
      name: "Profile",
      link: `/user/${user?.publicMetadata.userId}`,
    },
    {
      name: "Discover People",
      link: "/discover",
    },
  ];

  return (
    <AnimatePresence>
      <motion.nav
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "font-agrandir flex w-10/12 h-[60px] sm:h-auto md:w-3/5 lg:w-[45%] fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-zinc-950 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[1000] pr-2 pl-8 py-4  items-center justify-end sm:justify-center space-x-4",
          className
        )}
      >
        <div className="hidden sm:flex sm:flex-row sm:gap-8">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-neutral-50 items-center flex space-x-2  hover:text-neutral-300 "
              )}
            >
              <span className="block text-md sm:text-lg">{navItem.name}</span>
            </Link>
          ))}
        </div>
        <div className="hidden sm:flex sm:flex-row sm:gap-4">
          <SignedOut>
            <button className="border text-sm font-medium relative border-white/[0.2] text-neutral-100 px-4 py-2 rounded-full">
              <SignInButton />
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
            </button>
            <button className="border text-sm font-medium relative border-white/[0.2] text-neutral-100 px-4 py-2 rounded-full">
              <SignUpButton />
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </button>
          </SignedOut>
          {/* <SignedIn>
            <div className="border text-sm font-medium relative border-white/[0.2] text-neutral-100 px-4 py-2 rounded-full">
              <SignOutButton />
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </div>
          </SignedIn> */}
        </div>
        <div className="sm:hidden pr-4 my-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="font-agrandir z-[1001]">
              <DropdownMenuLabel>Go to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map((navItem: any, idx: number) => (
                <DropdownMenuItem key={`link=${idx}`}>
                  <Link href={navItem.link}>{navItem.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
