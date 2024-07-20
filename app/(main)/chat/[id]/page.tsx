import MessageContainer from "@/components/shared/MessageContainer";
import { getConversation, getMessages } from "@/lib/actions/chat.action";
import { auth } from "@clerk/nextjs/server";

const Chat = async ({ params }: { params: { id: string } }) => {
  const conversation = await getConversation(params.id);
  const { sessionClaims } = auth();

  if (!conversation) {
    // TODO: check if user exists with this id, if yes create a new conversation and redirect to it
    return <div>Not found</div>;
  }

  const messages = await getMessages(params.id);

  return (
    <>
      <MessageContainer
        conversation={conversation}
        messages={messages}
        userId={sessionClaims?.public_metadata?.userId}
      />
    </>
  );
};

export default Chat;
