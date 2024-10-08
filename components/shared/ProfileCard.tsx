"use client";

import { followUnfollow } from "@/lib/actions/user.action";
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
  MessageCircle,
  SlidersHorizontal,
  UserPlus,
  UserX,
} from "lucide-react";
import { toast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { sendJamRequest } from "@/lib/actions/chat.action";
import ProfileMatchStat from "./ProfileMatchStat";

const ProfileCard = ({ userProps }: { userProps: IUser | null }) => {
  const [user, setUser] = useState<IUser | null>(userProps);
  const { user: currentUser, isLoaded } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const pathname = usePathname();
  const [sendingJamRequest, setSendingJamRequest] = useState(false);

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
        duration: 2000,
      });
    }
  };

  const handleJamRequest = async () => {
    try {
      setSendingJamRequest(true);
      await sendJamRequest(
        currentUser?.publicMetadata?.userId as string,
        user?._id || ""
      );

      toast({
        title: "JAM request sent",
        description: `You've sent a JAM request to ${user?.firstName}`,
        variant: "default",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "Error sending JAM request",
        description: "Something went wrong, please try again later",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSendingJamRequest(false);
    }
  };

  if (!user || !currentUser) {
    return null;
  }

  return (
    <Card className="w-11/12 sm:w-[650px] text-left mx-auto">
      <CardHeader className="flex gap-3 flex-row items-center">
        <Link href={`/user/${user._id}`}>
          <Image
            src={user.photo}
            className="rounded-full"
            height={50}
            width={50}
            alt="PFP"
          />
        </Link>
        <div>
          <CardTitle className="tracking-wide text-md md:text-2xl">
            {user.firstName} {user.lastName}
          </CardTitle>
          <CardDescription className="text-xs sm:text-lg">
            <Link href={`/user/${user._id}`}>{user.username}</Link>
          </CardDescription>
          {(user.instruments.length > 0 || user.skills.length > 0) && (
            <span className="tracking-wide text-neutral-400 text-xs">
              Artist
            </span>
          )}
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
        {!isCurrentUserReqUser && (
          <div className="flex flex-row gap-1 items-center ml-auto">
            {/* <span>Profile Match: </span> */}
            <ProfileMatchStat data={user.similarity} />
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
        <div id="favoriteArtists" className="flex flex-wrap gap-3">
          {user?.favoriteArtists.map((artist, index) => (
            <Badge key={index}>{artist}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        <div className="flex gap-8">
          <span>{user.followers.length} followers</span>
          {!pathname.includes("discover") && (
            <span>{user.following.length} following</span>
          )}
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
              <Button
                disabled={sendingJamRequest}
                variant={"outline"}
                onClick={handleJamRequest}
              >
                {sendingJamRequest ? "Sending... " : "JAMM! request"}
              </Button>
              <Link href={`/chat/${user._id}?contact=true`}>
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
