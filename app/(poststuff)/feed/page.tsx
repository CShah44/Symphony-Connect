import FeedContainer from "@/components/shared/Feed";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

const Feed = () => {
  return (
    <>
      <FeedContainer />
      <Link href="/create">
        <Button className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-4 bottom-4 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
          <CirclePlus size={28} strokeWidth={3} />
        </Button>
      </Link>
    </>
  );
};

export default Feed;
