"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollYProgress, scrollY } = useScroll();
  const { user } = useUser();

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Feed",
      link: "/feed",
    },
    {
      name: "Profile",
      link: `/user/${user?.publicMetadata.userId}`,
    },
  ];

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (direction < 0) {
        setVisible(true);
      } else if (direction > 0 && current > 0.4) {
        setVisible(false);
      }
    }
  });

  const p = usePathname();

  useEffect(() => {
    setVisible(true);
  }, [p]);

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "font-agrandir flex w-11/12 md:w-3/5 lg:w-[45%] fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-zinc-950 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-4  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            onClick={() => setVisible(true)}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-2  hover:text-neutral-300 "
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="block text-md sm:text-lg">{navItem.name}</span>
          </Link>
        ))}
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
        <SignedIn>
          <div className="border text-sm font-medium relative border-white/[0.2] text-neutral-100 px-4 py-2 rounded-full">
            <SignOutButton />
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
          </div>
        </SignedIn>
      </motion.nav>
    </AnimatePresence>
  );
};
