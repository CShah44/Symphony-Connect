import { Button } from "@/components/ui/button";
import {
  changeOnboardingStatus,
  getOnboardData,
} from "@/lib/actions/musicprofile.action";
import Link from "next/link";
import { getUserById } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import MusicProfileForm from "@/components/shared/MusicProfileForm";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";

type OnBoardData = {
  genres: string[];
  instruments: string[];
  skills: string[];
  favoriteArtists: string[];
};

// here the use can edit the music profile
// made this a server component
const EditProfile = async () => {
  const data: OnBoardData = await getOnboardData();

  const metadata = (await currentUser())!.publicMetadata;
  const dbUser: IUser | null = await getUserById(metadata.userId);
  const isOnboarded = metadata.onboarded;

  if (!isOnboarded) changeOnboardingStatus(true);

  return (
    <div className="text-xl">
      <div className="flex justify-between w-[650px] mb-5">
        <h1 className="text-3xl">Edit Music Profile</h1>
        <Link href="/settings">
          <Button variant={"link"}>Go to account settings</Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <MusicProfileForm currentUser={dbUser} data={data} />
      </Suspense>
    </div>
  );
};

export default EditProfile;
