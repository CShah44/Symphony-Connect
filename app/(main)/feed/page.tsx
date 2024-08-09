import CommunityStats from "@/components/shared/CommunityStats";
import FeedContainer from "@/components/shared/Feed";
import RecommendedUsers from "@/components/shared/RecommendedUsers";
import Stories from "@/components/shared/Stories";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/actions/post.action";
import { CirclePlus, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

const Feed = async () => {
  const posts = await getPosts();

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
          <CommunityStats />
        </div>
        <div className="col-span-2 md:w-[650px] w-full mx-auto">
          <Stories />
          <FeedContainer initialPosts={posts} />
        </div>
        <div className="hidden lg:block">
          <RecommendedUsers />
        </div>
      </div>
      <div className="hidden sm:block">
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
      </div>
    </>
  );
};

export default Feed;
