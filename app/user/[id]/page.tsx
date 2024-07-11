"use client";

import ProfileCard from "@/components/shared/ProfileCard";
import { useParams } from "next/navigation";

const Profile = () => {
  const { id }: { id: string } = useParams();

  return <ProfileCard id={id} />;
};

export default Profile;
