import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const { sessionClaims } = auth();

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.public_metadata?.role !== "admin") {
    redirect("/feed");
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
