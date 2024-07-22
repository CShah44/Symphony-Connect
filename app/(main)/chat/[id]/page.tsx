import MessageContainer from "@/components/shared/MessageContainer";
import {
  verifyContact,
  createConversation,
  getConversation,
  getMessages,
} from "@/lib/actions/chat.action";
import { IConversation } from "@/lib/database/models/conversation.model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Chat = async ({ params }: { params: { id: string } }) => {
  const conversation = await getConversation(params.id);
  const { sessionClaims } = auth();

  if (!conversation) {
    // check if user exists with this id, if yes check if their chat exists
    const isMutual: IConversation | null = await verifyContact(
      sessionClaims?.public_metadata?.userId!,
      params.id
    );

    // if user exists and their chat doesn't exist, create a new one
    // if user doesn't exist, redirect to feed page
    if (isMutual && isMutual.type === "contact") {
      redirect(`/chat/${isMutual._id}`);
    } else {
      const newConversation = await createConversation(
        [params.id, sessionClaims?.public_metadata?.userId!],
        `${params.id} ${sessionClaims?.public_metadata?.userId}`,
        "contact"
      );

      redirect(`/chat/${newConversation._id}`);
    }
  }

  const messages = await getMessages(params.id);

  return (
    <MessageContainer
      conversation={conversation}
      messages={messages}
      userId={sessionClaims?.public_metadata?.userId}
    />
  );
};

export default Chat;
