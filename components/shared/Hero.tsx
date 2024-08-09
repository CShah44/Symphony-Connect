"use client";

import { motion, stagger } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Hero() {
  const fadeInUpVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <AuroraBackground>
      <motion.div
        initial="initial"
        whileInView="show"
        variants={fadeInUpVariants}
        className="relative flex flex-col gap-4 items-center justify-center px-4 font-agrandir"
      >
        <motion.div
          variants={fadeInUpVariants}
          className="font-extralight text-2xl md:text-4xl text-neutral-200 py-4"
        >
          Welcome to
        </motion.div>
        <motion.div variants={fadeInUpVariants}>
          <div className="font-melodrama text-7xl md:text-9xl font-bold text-zinc-100 text-center">
            SYMPHONY
          </div>
          <div className="font-melodrama text-6xl md:text-7xl font-bold text-zinc-100 text-center">
            CONNECT
          </div>
        </motion.div>
        <motion.div
          variants={fadeInUpVariants}
          className="font-extralight text-xl md:text-4xl text-neutral-200 py-4"
        >
          The music community you've been looking for
        </motion.div>
        <motion.div variants={fadeInUpVariants} className="flex gap-4">
          <SignedIn>
            <Link href="/feed">
              <button className="bg-neutral-200 hover:bg-neutral-400 rounded-full w-[200px] text-black px-4 py-2">
                Go to your feed
              </button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <button className="bg-neutral-200 hover:bg-neutral-400 rounded-full w-[100px] text-black px-4 py-2">
                Sign-In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="bg-neutral-200 hover:bg-neutral-400 rounded-full w-[100px] text-black px-4 py-2">
                Sign-Up
              </button>
            </Link>
          </SignedOut>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
