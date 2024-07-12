import { UserProfile } from "@clerk/nextjs";

const Settings = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full items-center justify-center my-[150px]">
      <h1 className="text-sm text-neutral-100 text-center font-agrandir">
        Any changes you make will be saved automatically and relflected in few
        minutes.
      </h1>
      <UserProfile />
    </div>
  );
};

export default Settings;
