import { connect } from "@/lib/database";
import { SignUp } from "@clerk/nextjs";

// todo change the appearance of sign up and sign in pages
export default async function Page() {
  await connect();

  return (
    <div className="flex h-[140vh] w-full justify-center items-center">
      <SignUp />
    </div>
  );
}
