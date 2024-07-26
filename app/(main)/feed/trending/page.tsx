import CommunityStats from "@/components/shared/CommunityStats";
import RecommendedUsers from "@/components/shared/RecommendedUsers";
import {
  getMostPopularArtists,
  getMostPopularGenres,
  getRecommendedUsers,
} from "@/lib/actions/utility.action";
import { clerkClient } from "@clerk/nextjs/server";

const Trending = async () => {
  const popularArtists: string[] = await getMostPopularArtists();
  const popularGenres: string[] = await getMostPopularGenres();
  const totalUsers: number = await clerkClient().users.getCount();
  const users = await getRecommendedUsers();

  return (
    <div className="my-3">
      <CommunityStats
        popularArtists={popularArtists}
        popularGenres={popularGenres}
        totalUsers={totalUsers}
      />
      <RecommendedUsers users={users} />
    </div>
  );
};

export default Trending;
