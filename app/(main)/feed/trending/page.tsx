import CommunityStats from "@/components/shared/CommunityStats";
import RecommendedUsers from "@/components/shared/RecommendedUsers";

const Trending = async () => {
  return (
    <div className="my-3 space-y-4">
      <CommunityStats />
      <RecommendedUsers />
    </div>
  );
};

export default Trending;
