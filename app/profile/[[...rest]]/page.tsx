import { UserProfile } from "@clerk/nextjs";

const Profile = () => {
  return (
    <div className="flex w-full h-full items-center justify-center my-[150px]">
      <UserProfile />
    </div>
  );
};

export default Profile;