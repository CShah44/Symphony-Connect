import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

  const userId = sessionClaims?.public_metadata?.userId;

  if (!userId) {
    return redirect("/feed");
  }

  const conversations: IConversation[] = await getUserConversations(userId);

  // only the followers can be added to groups
  const canBeParticiants: IParticipant[] = await getUserFollowers(userId);

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
        {conversations.map((conversation) => {
          let convName = "";
          let convPhoto = "";

          if (conversation.type === "group") {
            convName = conversation.groupName;
            convPhoto = conversation.groupPhoto;
          } else if (conversation.type === "contact") {
            if (
              sessionClaims?.public_metadata?.userId ===
              conversation.participants[0]._id
            ) {
              convName = conversation.participants[1].firstName;
              convPhoto = conversation.participants[1].photo;
            } else {
              convName = conversation.participants[0].firstName;
              convPhoto = conversation.participants[0].photo;
            }
          }
          return (
            <Link
              href={`/chat/${conversation._id}`}
              className="block"
              key={conversation._id}
            >
              <Card className="hover:bg-muted/20 transition-colors text-left pt-4">
                <CardContent className="">
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <Image
                      src={convPhoto}
                      alt={convName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <h2 className="text-lg font-medium">{convName}</h2>
                  </div>
                  <p className="text-sm text-zinc-500 text-left">
                    {conversation.participants
                      .map((participant) =>
                        participant._id === userId
                          ? "You"
                          : participant.firstName
                      )
                      .join(", ")}
                  </p>
                </CardContent>
                <CardFooter className="">
                  {conversation.lastMessage.text && (
                    <div className="flex text-left w-full gap-1 text-xs mr-auto text-neutral-200">
                      <div>{conversation.lastMessage.sender}: </div>
                      <div>
                        <span>
                          {conversation.lastMessage.text.slice(0, 20)}
                        </span>
                        <span>
                          {conversation.lastMessage.text.length > 20 && "..."}
                        </span>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChatHome;
