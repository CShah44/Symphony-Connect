import ProfileCard from "@/components/shared/ProfileCard";
import { SearchUsers } from "@/components/shared/SearchUsers";
import { getRecommendedUsers } from "@/lib/actions/utility.action";
import { IUser } from "@/lib/database/models/user.model";

const Discover = async (params: { searchParams: { search?: string } }) => {
  const query = params.searchParams?.search;

  const users: IUser[] = await getRecommendedUsers(query);

  return (
    <div className="md:w-[650px] w-full mx-auto text-left ">
      <SearchUsers />
      <br />
      <div className="flex flex-col gap-3 mb-4">
        {users.map((user: IUser, index: number) => (
          <ProfileCard key={user._id} userProps={user} />
        ))}
      </div>
    </div>
  );
};

export default Discover;
