"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouter } from "next/navigation";

const WelcomePage = () => {
  const [data, setData] = useState<any>(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.publicMetadata) {
      setData(user?.publicMetadata);
    } else {
      setInterval(() => {
        router.refresh();
      }, 4000);
    }
  }, [user, isLoaded]);

  const fadeInUpVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
        staggerChildren: 0.4,
      },
    },
  };

  return (
    <AuroraBackground>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeInUpVariants}
        className="flex flex-col items-center justify-center font-agrandir mt-[100px] z-[100] text-neutral-100"
      >
        <motion.h1
          variants={fadeInUpVariants}
          className="text-2xl md:text-3xl font-bold"
        >
          Welcome to
        </motion.h1>
        <motion.h1
          variants={fadeInUpVariants}
          className="font-melodrama text-6xl md:text-7xl"
        >
          SYMPHONY <br />
          CONNECT
        </motion.h1>
        <motion.p
          variants={fadeInUpVariants}
          className="text-md md:text-lg text-center p-5 w-full md:w-2/3 lg:w-1/2"
        >
          We are excited to have you join us! We are a community of musicians
          who share their passion for music and connect with like-minded people.
          Join us and discover new music, connect with fellow musicians, and
          share your love for music with the world.
        </motion.p>
        <motion.p
          variants={fadeInUpVariants}
          className="text-sm sm:text-md w-full md:w-2/3 lg:w-1/2 p-5 text-center text-neutral-200"
        >
          Please wait while we set up your account. This might take a few
          seconds. Consider reloading if takes longer.
        </motion.p>
        {!data?.userId && (
          <motion.div variants={fadeInUpVariants}>Loading...</motion.div>
        )}
        {data?.userId && (
          <motion.div variants={fadeInUpVariants} className="space-x-4 p-5">
            <Link href="/user/edit">
              <Button variant={"default"}>
                Complete Setting Up Your Profile
              </Button>
            </Link>
            <Link href={`/user/${data?.userId}`}>
              <Button variant={"outline"}>Skip for now</Button>
            </Link>
          </motion.div>
        )}
      </motion.div>{" "}
    </AuroraBackground>
  );
};

export default WelcomePage;
