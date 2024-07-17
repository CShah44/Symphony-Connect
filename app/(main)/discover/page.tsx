import ProfileCard from "@/components/shared/ProfileCard";
import { SearchUsers } from "@/components/shared/SearchUsers";
import { getUsers } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";

const Discover = async (params: { searchParams: { search?: string } }) => {
  const query = params.searchParams?.search;

  const users = await getUsers(query);

  return (
    <div className="md:w-[650px] w-full mx-auto text-left ">
      <SearchUsers />
      <br />
      {users.map((user: IUser) => (
        <ProfileCard key={user._id} userProps={user} />
      ))}
    </div>
  );
};

export default Discover;
