import CommunityStats from "@/components/shared/CommunityStats";
import FeedContainer from "@/components/shared/Feed";
import RecommendedUsers from "@/components/shared/RecommendedUsers";
import { Button } from "@/components/ui/button";
import {
  getMostPopularArtists,
  getMostPopularGenres,
  getRecommendedUsers,
} from "@/lib/actions/utility.action";
import { clerkClient } from "@clerk/nextjs/server";
import { CirclePlus, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

const Feed = async () => {
  // todo change to recommended users
  const users = await getRecommendedUsers();

  const popularArtists: string[] = await getMostPopularArtists();
  const popularGenres: string[] = await getMostPopularGenres();
  const totalUsers: number = await clerkClient().users.getCount();

  return (
    <>
      <div className="lg:hidden block">
        <Link href="/feed/trending">
          <Button className="flex gap-3 mx-auto" variant={"outline"}>
            See What's Trending
            <TrendingUp size={28} strokeWidth={3} />
          </Button>
        </Link>
      </div>
      <div className="lg:grid lg:grid-cols-4 lg:gap-1 lg:items-start">
        <div className="hidden lg:block">
          <CommunityStats
            popularArtists={popularArtists}
            popularGenres={popularGenres}
            totalUsers={totalUsers}
          />
        </div>
        <FeedContainer />
        <div className="hidden lg:block">
          <RecommendedUsers users={users} />
        </div>
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
