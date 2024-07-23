import { IUser } from "@/lib/database/models/user.model";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";

const RecommendedUsers = ({ users }: { users: IUser[] }) => {
  return (
    <Card className="mx-auto w-11/12 col-span-1 rounded-2xl p-4 hidden sm:block bg-transparent">
      <CardHeader className="text-xl font-bold my-1">Who to follow</CardHeader>
      <CardContent className="grid gap-3 p-1">
        {users.map((user) => (
          <div
            key={user._id}
            className="rounded-xl bg-zinc-950 hover:bg-zinc-800 shadow-md p-4 w-full flex flex-col items-start"
          >
            <Link href={`/user/${user._id}`}>
              <div className="flex gap-3 flex-row items-center w-full">
                <Image
                  src={user.photo}
                  className="rounded-full"
                  height={50}
                  width={50}
                  alt="PFP"
                />
                <div className="flex flex-col text-left">
                  <span className="tracking-wide text-lg">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-sm text-zinc-300">{user.username}</span>
                </div>
              </div>
            </Link>
            <div className="flex items-center mt-2 p-2 justify-start">
              <div className="w-4 h-4 rounded-full bg-gray-300 mr-2" />
              <span className="text-gray-500">30%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendedUsers;
