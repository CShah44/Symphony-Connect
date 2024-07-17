"use client";

import { followUnfollow, getUserById } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import { useEffect, useState } from "react";
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
import { usePathname } from "next/navigation";

const ProfileCard = ({ userProps }: { userProps: IUser | null }) => {
  const [user, setUser] = useState<IUser | null>(userProps);
  const { user: currentUser, isLoaded } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      const val = user?.followers.includes(
        (currentUser?.publicMetadata?.userId as string) || ""
      );

      setIsFollowing(val);
    }
  }, [isLoaded, user]);

  // is the current user the user we're logged in as?
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

  return (
    <Card className="w-full sm:w-[650px] text-left mx-auto">
      <CardHeader className="flex gap-3 flex-row items-center">
        <Image
          src={user.photo}
          className="rounded-full"
          height={50}
          width={50}
          alt="PFP"
        />
        <div>
          <CardTitle className="tracking-wide">
            {user.firstName} {user.lastName}
          </CardTitle>
          <CardDescription className="text-md">{user.username}</CardDescription>
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
        {pathname.includes("discover") && (
          <Link className="ml-auto" href={`/user/${user._id}`}>
            <Button variant="outline">Go to Profile</Button>
          </Link>
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
    </Card>
  );
};

export default ProfileCard;
