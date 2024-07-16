"use client";

import ProfileCard from "@/components/shared/ProfileCard";
import { useParams } from "next/navigation";
import FeedContainer from "@/components/shared/Feed";

const Profile = () => {
  const { id }: { id: string } = useParams();

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <ProfileCard id={id} />
      <FeedContainer id={id} />
    </div>
  );
};

export default Profile;
