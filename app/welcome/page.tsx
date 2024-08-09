"use client";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WelcomePage = () => {
  const [data, setData] = useState<any>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user?.publicMetadata) {
      setData(user?.publicMetadata);
    }
  }, [user, isLoaded]);

  return (
    <div className="flex flex-col items-center justify-center font-agrandir mt-[180px]">
      <h1 className="text-2xl font-bold">Welcome to</h1>
      <h1 className="font-melodrama text-6xl">
        SYMPHONY <br />
        CONNECT
      </h1>
      <p className="text-lg text-center p-5 w-full md:w-2/3 lg:w-1/2">
        We are excited to have you join us! We are a community of musicians who
        share their passion for music and connect with like-minded people. Join
        us and discover new music, connect with fellow musicians, and share your
        love for music with the world.
      </p>
      <p className="text-md w-full md:w-2/3 lg:w-1/2 p-5 text-center text-neutral-200">
        Please wait while we set up your account. You will be redirected to the
        onboarding page once your account is ready.
      </p>
      {data ? (
        <div className="space-x-4 p-5">
          <Link href="/user/edit">
            <Button variant={"default"}>Complete Onboarding</Button>
          </Link>
          <Link href={`/user/${data?.userId}`}>
            <Button variant={"outline"}>Skip Onboarding</Button>
          </Link>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default WelcomePage;
