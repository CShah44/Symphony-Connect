import {
  getMostPopularArtists,
  getMostPopularGenres,
} from "@/lib/actions/utility.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { clerkClient } from "@clerk/nextjs/server";

const CommunityStats = async () => {
  const popularArtists: string[] = await getMostPopularArtists();
  const popularGenres: string[] = await getMostPopularGenres();
  const totalUsers: number = await clerkClient().users.getCount();

  return (
    <Card className="mx-auto w-11/12 col-span-1 rounded-2xl p-4 bg-transparent">
      <CardHeader className="text-xl font-bold my-1 text-left">
        What's Trending?
        <CardDescription className="text-left font-normal">
          Take a look at what's trending in the community
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-col items-start">
          <span className="text-lg">Popular Artists</span>
          <div className="flex flex-wrap gap-2 justify-start items-center py-2">
            {popularArtists.map((artist) => (
              <div
                key={artist}
                className="rounded-full bg-zinc-950 hover:bg-zinc-800 shadow-md p-2 flex flex-col items-center"
              >
                <span className="text-sm">{artist}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-lg">Popular Genres</span>
          <div className="flex flex-wrap gap-2 justify-start items-center py-2">
            {popularGenres.map((genre) => (
              <div
                key={genre}
                className="rounded-full bg-zinc-950 hover:bg-zinc-800 shadow-md p-2 flex flex-col items-center"
              >
                <span className="text-sm">{genre}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-center">
        <span className="text-sm">
          Active Users in the Community:{" "}
          <span className="text-xl">{totalUsers}</span>
        </span>
      </CardFooter>
    </Card>
  );
};

export default CommunityStats;