import CommunityStats from "@/components/shared/CommunityStats";
import RecommendedUsers from "@/components/shared/RecommendedUsers";
import { getRecommendedUsers } from "@/lib/actions/utility.action";

const Trending = async () => {
  const users = await getRecommendedUsers();

  return (
    <div className="my-3">
      <CommunityStats />
      <RecommendedUsers users={users} />
    </div>
  );
};

export default Trending;
