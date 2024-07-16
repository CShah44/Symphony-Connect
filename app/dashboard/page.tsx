import { SearchUsers } from "@/components/shared/SearchUsers";
import UsersTable from "@/components/shared/UsersTable";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = async (params: { searchParams: { search?: string } }) => {
  const { sessionClaims } = auth();

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.public_metadata?.role !== "admin") {
    redirect("/feed");
  }

  const query = params.searchParams.search;

  const users = (await clerkClient().users.getUserList({ query })).data.map(
    (user: any) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddresses[0].emailAddress,
        publicMetadata: user.publicMetadata,
        username: user.username,
      };
    }
  );

  return (
    <div className="font-agrandir pt-[130px] text-center mx-auto w-full sm:w-[650px] md:w-[800px]">
      <span className="mb-10 mx-auto">Dashboard</span>
      <SearchUsers />
      <br />
      <UsersTable users={users} />
    </div>
  );
};

export default Dashboard;
