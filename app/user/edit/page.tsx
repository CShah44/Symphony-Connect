"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  changeOnboardingStatus,
  getOnboardData,
} from "@/lib/actions/musicprofile.action";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import MusicProfileForm from "@/components/shared/MusicProfileForm";

// here the use can edit the music profile
// todo make this server component
const EditProfile = () => {
  const [data, setData] = useState({
    genres: [],
    instruments: [],
    skills: [],
    favoriteArtists: [],
    bio: "I don't know! I just crashed here!",
  });
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const preloadData = async () => {
      const d = await getOnboardData();

      setData(d);
    };

    const getCurrentUser = async () => {
      const res = await getUserById(user?.publicMetadata?.userId);
      setCurrentUser(res);
      setUserLoaded(true);
    };

    if (user?.publicMetadata?.onboarded) setIsOnboarded(true);
    if (isLoaded && user?.publicMetadata?.onboarded) getCurrentUser();
    if (!isOnboarded) changeOnboardingStatus(true);

    preloadData();
    setIsLoading(false);
  }, [isLoaded]);

  return (
    <div className="text-xl">
      <div className="flex justify-between w-[650px] mb-5">
        <h1 className="text-3xl">Edit Music Profile</h1>
        <Link href="/settings">
          <Button variant={"link"}>Go to account settings</Button>
        </Link>
      </div>
      {isLoading && !isLoaded && !userLoaded ? (
        <div className="flex justify-center items-center w-[650px] h-full">
          Loading..
        </div>
      ) : null}
      {!isLoading && isLoaded && userLoaded && (
        <MusicProfileForm currentUser={currentUser} data={data} />
      )}
    </div>
  );
};

export default EditProfile;
