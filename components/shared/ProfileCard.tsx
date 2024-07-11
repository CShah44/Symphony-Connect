"use client";

import { getUserById } from "@/lib/actions/user.action";
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
import Image from "next/image";
import { Badge } from "../ui/badge";

const ProfileCard = ({ id }: { id: string }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    async function getUser() {
      const res = await getUserById(id);
      setUser(res);
    }

    getUser();
  }, []);

  console.log(user);

  if (!user) {
    return null;
  }

  return (
    <Card className="w-[650px]">
      <CardHeader className="flex gap-3 flex-row items-center">
        <Image
          src={user.photo}
          className="rounded-full"
          height={50}
          width={50}
          alt="PFP"
        />
        <div>
          <CardTitle>{user.firstName + user.lastName}</CardTitle>
          <CardDescription>{user.username}</CardDescription>
        </div>
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
      <CardFooter>
        {user.followers.length} followers {user.following.length} following
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
