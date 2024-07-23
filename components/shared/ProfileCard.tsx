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
import {
  CircleUserRound,
  MessageCircle,
  SlidersHorizontal,
  UserPlus,
  UserX,
} from "lucide-react";
import { toast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { sendJamRequest } from "@/lib/actions/chat.action";

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

  const handleJamRequest = async () => {
    try {
      await sendJamRequest(
        currentUser?.publicMetadata?.userId as string,
        user?._id || ""
      );

      toast({
        title: "JAM request sent",
        description: `You've sent a JAM request to this ${user?.firstName}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error sending JAM request",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  };

  if (!user || !currentUser) {
    return null;
  }

  return (
    <Card className="w-11/12 sm:w-[650px] text-left mx-auto">
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
          <div className="ml-auto flex flex-row gap-3">
            {(user.instruments.length > 0 || user.skills.length > 0) && (
              <Badge className="tracking-wide">Artist</Badge>
            )}

            <Link href={`/user/${user._id}`}>
              <Button variant="outline">
                <CircleUserRound />
              </Button>
            </Link>
          </div>
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
          <div className="flex justify-between w-full">
            <Button
              onClick={handleFollowUnfollow}
              variant={isFollowing ? "secondary" : "outline"}
            >
              {isFollowing ? <UserX /> : <UserPlus />}
            </Button>
            <div className="flex gap-3 items-center">
              <Button variant={"outline"} onClick={handleJamRequest}>
                JAMM! request
              </Button>
              <Link href={`/chat/${user._id}`}>
                <Button variant="outline">
                  <MessageCircle />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
