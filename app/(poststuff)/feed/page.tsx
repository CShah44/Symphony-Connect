import FeedContainer from "@/components/shared/Feed";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Feed = () => {
  return (
    <>
      <FeedContainer />
      <Link href="/create">
        <Button className="rounded-full fixed w-16 h-16 drop-shadow-lg shadow-yellow-100 right-3 bottom-3 text-slate-800 bg-neutral-200 hover:bg-neutral-400">
          Create
        </Button>
      </Link>
    </>
  );
};

export default Feed;
