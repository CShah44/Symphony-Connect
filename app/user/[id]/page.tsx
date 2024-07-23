// "use client";

import ProfileCard from "@/components/shared/ProfileCard";
// import { useParams } from "next/navigation";
import FeedContainer from "@/components/shared/Feed";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import { toast } from "@/components/ui/use-toast";
import { IUser } from "@/lib/database/models/user.model";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";

const Profile = async ({ params }: { params: { id: string } }) => {
  const user: IUser | null = await getUserById(params.id);
  const { sessionClaims } = auth();

  if (!user) {
    toast({
      title: "Error",
      description: "User not found",
      variant: "destructive",
    });
    redirect("/feed");
  }

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Suspense
        fallback={<Skeleton className="w-11/12 sm:w-[650px] h-[300px]" />}
      >
        <ProfileCard userProps={user} />
      </Suspense>
      {user.role === "admin" &&
        sessionClaims?.public_metadata?.userId === user?._id && (
          <Card className="w-11/12 sm:w-[650px] mx-auto">
            <CardHeader className="text-lg">You're an admin</CardHeader>
            <CardContent className="flex gap-2 items-center">
              You can manage users through the dashboard.
              <Link href={"/dashboard"}>
                <Button variant={"outline"}>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      <FeedContainer id={params.id} />
    </div>
  );
};

export default Profile;
