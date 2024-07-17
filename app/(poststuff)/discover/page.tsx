import ProfileCard from "@/components/shared/ProfileCard";
import { getUsers } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";

// need state management for this
const Discover = async () => {
  const users = await getUsers();

  return (
    <>
      {users.map((user: IUser) => (
        <ProfileCard key={user._id} userProps={user} />
      ))}
    </>
  );
};

export default Discover;
