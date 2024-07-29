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

type OnBoardData = {
  genres: string[];
  instruments: string[];
  skills: string[];
  favoriteArtists: string[];
};

// todo this gives error that user not found which shouln't be the case
const EditProfile = async () => {
  const data: OnBoardData = await getOnboardData();

  const metadata = auth()!.sessionClaims!.public_metadata;
  const isOnboarded = metadata.onboarded || false;

  if (!isOnboarded) changeOnboardingStatus(true);

  return (
    <div className="text-xl">
      <div className="flex justify-between w-[650px] mb-5">
        <h1 className="text-3xl">Edit Music Profile</h1>
        <Link href="/settings">
          <Button variant={"link"}>Go to account settings</Button>
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="w-[650px] h-[500px]" />}>
        <MusicProfileForm data={data} />
      </Suspense>
    </div>
  );
};

export default EditProfile;
