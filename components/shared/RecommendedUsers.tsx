import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRecommendedUsers } from "@/lib/actions/utility.action";
import { IUser } from "@/lib/database/models/user.model";

const RecommendedUsers = async () => {
  const users = (await getRecommendedUsers()).slice(0, 5);

  return (
    <TooltipProvider>
      <Card className="mx-auto w-11/12 col-span-1 rounded-2xl p-4 bg-black/10">
        <CardHeader className="text-xl font-bold my-1">
          Who to follow
        </CardHeader>
        <CardContent className="grid gap-3 p-1">
          {users.map((user: IUser) => (
            <div
              key={user._id}
              className="rounded-xl bg-zinc-950 hover:bg-zinc-900 shadow-md p-4 w-full flex flex-col items-start"
            >
              <Link href={`/user/${user._id}`}>
                <div className="flex gap-2 flex-row items-center w-full">
                  <Image
                    src={user.photo}
                    className="rounded-full"
                    height={40}
                    width={40}
                    alt="PFP"
                  />
                  <div className="flex flex-col text-left">
                    <span className="tracking-wide text-lg">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-sm text-zinc-300">
                      {user.username}
                    </span>
                  </div>
                </div>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className="w-full ">
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
                      <div
                        className="bg-blue-800 h-2 rounded-full text-center text-white text-xs leading-none"
                        style={{ width: `${user.similarity}%` }}
                      ></div>
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>
                    <span className="text-sm">{`Profile match: ${user.similarity}%`}</span>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RecommendedUsers;
