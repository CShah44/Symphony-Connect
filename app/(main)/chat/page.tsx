import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import CreateConversation from "@/components/shared/CreateConversation";
import { getUserConversations } from "@/lib/actions/chat.action";
import { getUserFollowers } from "@/lib/actions/user.action";
import {
  IConversation,
  IParticipant,
} from "@/lib/database/models/conversation.model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ChatHome = async () => {
  const { sessionClaims } = auth();

  if (!sessionClaims?.public_metadata?.userId) {
    return redirect("/feed");
  }

  const conversations: IConversation[] = await getUserConversations(
    sessionClaims?.public_metadata?.userId
  );

  // only the followers can be added to groups
  const canBeParticiants: IParticipant[] = await getUserFollowers(
    sessionClaims?.public_metadata?.userId
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <CreateConversation
          followers={canBeParticiants}
          currUserId={sessionClaims?.public_metadata?.userId}
        />
      </div>
      <div className="grid w-11/12 sm:w-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {conversations.map((conversation) => (
          <Link
            href={`/chat/${conversation._id}`}
            className="block"
            key={conversation._id}
          >
            <Card className="hover:bg-muted/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-start gap-2 mb-2">
                  <Image
                    src={conversation.groupPhoto || ""}
                    alt={conversation.groupName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <h2 className="text-lg font-medium">
                    {conversation.groupName}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {conversation.participants
                    .map((participant) => participant.firstName)
                    .join(", ")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatHome;
