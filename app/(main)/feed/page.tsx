import CommunityStats from "@/components/shared/CommunityStats";
import FeedContainer from "@/components/shared/Feed";
import RecommendedUsers from "@/components/shared/RecommendedUsers";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/lib/actions/user.action";
import {
  getMostPopularArtists,
  getMostPopularGenres,
} from "@/lib/actions/utility.action";
import { clerkClient } from "@clerk/nextjs/server";
import { CirclePlus, MessageSquare } from "lucide-react";
import Link from "next/link";

const Feed = async () => {
  // todo change to recommended users
  const users = await getUsers();

  const popularArtists: string[] = await getMostPopularArtists();
  const popularGenres: string[] = await getMostPopularGenres();
  const totalUsers: number = await clerkClient().users.getCount();

  return (
    <>
      {/* todo change to 2 columns for md ie, feed and recommended users */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-1 lg:items-start">
        <CommunityStats
          popularArtists={popularArtists}
          popularGenres={popularGenres}
          totalUsers={totalUsers}
        />
        <FeedContainer />
        <RecommendedUsers users={users} />
      </div>
      <Link href="/create">
        <Button className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-4 bottom-4 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
          <CirclePlus size={28} strokeWidth={3} />
        </Button>
      </Link>
      <Link href="/chat">
        <Button className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-4 bottom-24 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
          <MessageSquare size={28} strokeWidth={3} />
        </Button>
      </Link>
    </>
  );
};

export default Feed;
