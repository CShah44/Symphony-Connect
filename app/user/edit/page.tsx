import { Button } from "@/components/ui/button";
import {
  changeOnboardingStatus,
  getOnboardData,
} from "@/lib/actions/musicprofile.action";
import Link from "next/link";
import MusicProfileForm from "@/components/shared/MusicProfileForm";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCurrentUser,
  getDefaultMusicProfile,
} from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";

type OnBoardData = {
  genres: string[];
  instruments: string[];
  skills: string[];
  favoriteArtists: string[];
};

const EditProfile = async () => {
  const data: OnBoardData = await getOnboardData();
  const defaultData = await getDefaultMusicProfile();

  const metadata = auth()!.sessionClaims!.public_metadata;
  const isOnboarded = metadata.onboarded || false;

  if (!isOnboarded) changeOnboardingStatus(true);

  return (
    <Suspense fallback={<Skeleton className="w-[650px] h-[800px]" />}>
      <div className="flex flex-col justify-start gap-3 w-[650px] h-[500px] p-4">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl md:text-3xl">Edit Music Profile</h1>
          <Link href="/settings">
            <Button variant={"link"}>Go to account settings</Button>
          </Link>
        </div>
        <MusicProfileForm data={data} defaultData={defaultData} />
        <br />
      </div>
    </Suspense>
  );
};

export default EditProfile;
