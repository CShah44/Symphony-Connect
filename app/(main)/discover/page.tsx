import ProfileCard from "@/components/shared/ProfileCard";
import { SearchUsers } from "@/components/shared/SearchUsers";
import { getUsers } from "@/lib/actions/user.action";
import { getRecommendedUsers } from "@/lib/actions/utility.action";
import { IUser } from "@/lib/database/models/user.model";

const Discover = async (params: { searchParams: { search?: string } }) => {
  const query = params.searchParams?.search;

  let users: IUser[] = [];

  if (query) users = await getUsers(query);
  else {
    users = await getRecommendedUsers();
  }

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
