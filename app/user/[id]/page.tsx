"use client";

import ProfileCard from "@/components/shared/ProfileCard";
import { useParams } from "next/navigation";
import FeedContainer from "@/components/shared/Feed";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import { toast } from "@/components/ui/use-toast";
import { IUser } from "@/lib/database/models/user.model";

const Profile = () => {
  const { id }: { id: string } = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    setLoading(true);
    async function getUser() {
      try {
        const res = await getUserById(id);
        setUser(res);
      } catch (error) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        router.push("/");
      }
      setLoading(false);
    }

    getUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      {loading && <div>Loading...</div>}
      {!loading && user && <ProfileCard userProps={user} />}
      <FeedContainer id={id} />
    </div>
  );
};

export default Profile;
