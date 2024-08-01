import { connect } from "@/lib/database";
import { SignUp } from "@clerk/nextjs";

export default async function Page() {
  await connect();

  return (
    <div className="flex h-[140vh] w-full justify-center items-center">
      <SignUp />
    </div>
  );
}
