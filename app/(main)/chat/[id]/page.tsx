import MessageContainer from "@/components/shared/MessageContainer";
import { toast } from "@/components/ui/use-toast";
import {
  verifyContact,
  createConversation,
  getConversation,
  getMessages,
} from "@/lib/actions/chat.action";
import { IConversation } from "@/lib/database/models/conversation.model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Chat = async (params: {
  params: { id: string };
  searchParams: { contact?: boolean };
}) => {
  const conversation = await getConversation(params.params.id);
  const { sessionClaims } = auth();

  if (!conversation) {
    // if user exists and their chat doesn't exist, create a new one
    // if user doesn't exist, redirect to feed page
    if (params.searchParams.contact) {
      // check if user exists with this id, if yes check if their chat exists
      const isMutual: IConversation | null = await verifyContact(
        sessionClaims?.public_metadata?.userId!,
        params.params.id
      );

      if (isMutual && isMutual.type === "contact") {
        redirect(`/chat/${isMutual._id}`);
      } else {
        const newConversation = await createConversation(
          [sessionClaims?.public_metadata?.userId!, params.params.id],
          `${params.params.id} ${sessionClaims?.public_metadata?.userId}`,
          "contact"
        );

        redirect(`/chat/${newConversation._id}`);
      }
    } else {
      toast({
        title: "Oops!",
        description: "Could not find the conversation",
        variant: "destructive",
      });
      redirect(`/chat`);
    }
  }

  const messages = await getMessages(params.params.id);

  return (
    <MessageContainer
      conversation={conversation}
      messages={messages}
      userId={sessionClaims?.public_metadata?.userId}
    />
  );
};

export default Chat;
