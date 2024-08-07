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
import { getUserById } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";

type OnBoardData = {
  genres: string[];
  instruments: string[];
  skills: string[];
  favoriteArtists: string[];
};

const EditProfile = async (params: { searchParams: { onboard: boolean } }) => {
  const data: OnBoardData = await getOnboardData();

  const metadata = auth()!.sessionClaims!.public_metadata;
  const isOnboarded = metadata.onboarded || false;
  const dbUser: IUser | null = params.searchParams.onboard
    ? null
    : await getUserById(metadata.userId);

  if (!isOnboarded) changeOnboardingStatus(true);

  return (
    <Suspense fallback={<Skeleton className="w-[650px] h-[500px]" />}>
      <div className="flex flex-col justify-start gap-3 ">
        <div className="flex justify-between w-[650px] mb-5">
          <h1 className="text-3xl">Edit Music Profile</h1>
          <Link href="/settings">
            <Button variant={"link"}>Go to account settings</Button>
          </Link>
        </div>
        <MusicProfileForm data={data} currentUser={dbUser} />
      </div>
    </Suspense>
  );
};

export default EditProfile;
