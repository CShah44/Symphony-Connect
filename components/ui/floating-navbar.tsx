"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import {
  CirclePlus,
  CircleUser,
  Menu,
  MessageCircle,
  Newspaper,
  UserRoundSearch,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "./avatar";
import { usePathname } from "next/navigation";

export const FloatingNav = ({ className }: { className?: string }) => {
  const { user } = useUser();
  const pathname = usePathname();

  if (pathname.includes("sign-in") || pathname.includes("sign-up")) return null;

  const navItems = [
    {
      name: "Feed",
      link: "/feed",
      icon: <Newspaper size={18} />,
    },
    {
      name: "Profile",
      link: `/user/${user?.publicMetadata.userId}`,
      icon: <CircleUser size={18} />,
    },
    {
      name: "Discover People",
      link: "/discover",
      icon: <UserRoundSearch size={18} />,
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
          "font-agrandir flex sm:grid sm:grid-flow-row sm:grid-cols-5 w-10/12 h-[60px] sm:h-auto md:w-3/5 lg:w-[50%] fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black/20 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[1000] pr-2 pl-8 py-4  space-x-4 items-center justify-end sm:justify-center backdrop-blur-2xl",
          className
        )}
      >
        <Avatar className="sm:col-span-1">
          <AvatarImage
            className="hidden sm:block"
            src="/favicon.png"
            alt="icon"
          />
        </Avatar>
        <div className="hidden sm:flex sm:flex-row sm:gap-8 col-span-4 lg:col-span-3 pr-5">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-neutral-50 items-center flex space-x-1 justify-center  hover:text-neutral-300 "
              )}
            >
              {navItem.icon}
              <span className="block text-md">{navItem.name}</span>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-row lg:gap-4 col-span-1">
          <SignedIn>
            <div className="border text-sm font-medium relative border-white/[0.2] text-neutral-100 px-4 py-2 rounded-full">
              <SignOutButton />
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </div>
          </SignedIn>
        </div>
        <div className="sm:hidden pr-4 ml-auto my-auto">
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent side={"bottom"} className="font-agrandir w-screen">
              <SheetHeader>
                <SheetTitle className="font-melodrama text-3xl ">
                  SYMPHONY CONNECT
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-5 mb-10 mt-16">
                {navItems.map((navItem: any, idx: number) => (
                  <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    className={cn(
                      "relative text-neutral-50 items-center flex space-x-2  hover:text-neutral-300 "
                    )}
                  >
                    {navItem.icon}
                    <span className="block text-md ">{navItem.name}</span>
                  </Link>
                ))}
                <Link
                  href={"/create"}
                  className={cn(
                    "relative text-neutral-50 items-center flex space-x-2  hover:text-neutral-300 "
                  )}
                >
                  <CirclePlus size={18} />
                  <span className="block text-md ">Create a post</span>
                </Link>
                <Link
                  href={"/chat"}
                  className={cn(
                    "relative text-neutral-50 items-center flex space-x-2  hover:text-neutral-300 "
                  )}
                >
                  <MessageCircle size={18} />
                  <span className="block text-md ">Chat</span>
                </Link>
              </div>
              <SignedIn>
                <div className="border text-sm font-medium relative border-white/[0.2] text-neutral-100 px-6 py-4 rounded-full w-[200px]">
                  <SignOutButton />
                  <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                </div>
              </SignedIn>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
