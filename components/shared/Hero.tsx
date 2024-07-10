"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import Link from "next/link";

export default function Hero() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 font-agrandir"
      >
        <div className="font-extralight md:text-4xl text-neutral-200 py-4">
          Welcome to
        </div>
        <div>
          <div className="font-melodrama text-6xl md:text-9xl font-bold text-zinc-100 text-center">
            SYMPHONY
          </div>
          <div className="font-melodrama text-5xl md:text-7xl font-bold text-zinc-100 text-center">
            CONNECT
          </div>
        </div>
        <div className="font-extralight md:text-4xl text-neutral-200 py-4">
          The music community you've been looking for
        </div>
        <Link href="/sign-in">
          <button className="bg-neutral-200 hover:bg-neutral-400 rounded-full w-20 text-black px-4 py-2">
            Join
          </button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}