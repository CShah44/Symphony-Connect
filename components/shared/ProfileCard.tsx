"use client";

import { followUnfollow, getUserById } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import { use, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "../ui/use-toast";

const ProfileCard = ({ id }: { id: string }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const { user: currentUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getUser() {
      const res = await getUserById(id);
      setUser(res);
    }

    getUser();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      setIsFollowing(user?.following.includes(currentUser?.id || ""));
    }
  }, [user]);

  const isCurrentUserReqUser = currentUser?.id === user?.clerkId;

  const handleFollowUnfollow = async () => {
    try {
      await followUnfollow(
        currentUser?.publicMetadata?.userId || "",
        user?._id || ""
      );

      if (isFollowing) {
        user?.followers.pop();
        setUser(user);
      } else {
        user?.followers.push(currentUser?.id || "");
        setUser(user);
      }

      setIsFollowing((prev) => !prev);
    } catch (error) {
      toast({
        title: "Error following/unfollowing",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  };

  if (!user || !currentUser) {
    return null;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-[650px]">
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <CardHeader className="flex gap-3 flex-row items-center">
            <Image
              src={user.photo}
              className="rounded-full"
              height={50}
              width={50}
              alt="PFP"
            />
            <div>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>{user.username}</CardDescription>
            </div>
            {isCurrentUserReqUser && (
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  <SlidersHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-agrandir">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/user/edit">Edit Music Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="mb-3">{user.bio || ""}</p>
            <div id="instruments" className="flex flex-wrap gap-3">
              {user?.instruments.map((instrument, index) => (
                <Badge key={index}>{instrument}</Badge>
              ))}
            </div>
            <div id="skills" className="flex flex-wrap gap-3">
              {user?.skills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
            <div id="genres" className="flex flex-wrap gap-3">
              {user?.genres.map((genre, index) => (
                <Badge key={index}>{genre}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <div className="flex gap-8">
              <span>{user.followers.length} followers</span>
              <span>{user.following.length} following</span>
            </div>

            {!isCurrentUserReqUser && (
              <Button onClick={handleFollowUnfollow} variant="outline">
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ProfileCard;
