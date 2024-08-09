"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { IMessage } from "@/lib/database/models/message.model";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient";
import { Input } from "../ui/input";
import {
  deleteGroup,
  leaveConversation,
  sendMessage,
} from "@/lib/actions/chat.action";
import { toast } from "../ui/use-toast";
import { IConversation } from "@/lib/database/models/conversation.model";
import { formatDateTime } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

export default function MessageContainer({
  messages: preLoadedMessages,
  userId,
  conversation,
}: {
  conversation: IConversation;
  userId?: string;
  messages: IMessage[];
}) {
  const [messages, setMessages] = useState(preLoadedMessages);
  const conversationId = conversation._id;
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    pusherClient.bind("new-message", (data: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusherClient.unsubscribe(conversationId);
    };
  }, []);

  async function onSubmit() {
    try {
      const text = inputRef.current?.value;

      if (!text) return;

      await sendMessage(conversationId, text, userId);

      inputRef.current.value = "";
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not send message! Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  }

  let convName;

  if (conversation.type === "group") {
    convName = conversation.groupName;
  } else if (conversation.type === "contact") {
    if (userId === conversation.participants[0]._id) {
      convName = conversation.participants[1].firstName;
    } else {
      convName = conversation.participants[0].firstName;
    }
  }

  const isUserAdmin = conversation.createdBy._id === userId;

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(conversationId);

      router.replace("/chat");
      toast({
        title: "Group deleted!",
        description: "Group has been deleted successfully.",
        variant: "destructive",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not delete group! Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleLeaveConversation = async () => {
    try {
      await leaveConversation(conversationId, userId!, conversation.type);

      router.replace("/chat");
      toast({
        title: "Conversation left!",
        description: `You left the conversation`,
        variant: "destructive",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Could not leave conversation! Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col border h-screen sm:h-[80vh] w-full md:w-10/12 lg:w-8/12 mx-auto rounded-3xl">
      <div className="shadow-2xl rounded-3xl w-full p-4 flex items-center gap-4 mx-auto">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2"
          prefetch={false}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>

        <Dialog>
          <DialogTrigger className="text-lg font-medium  mx-auto flex-1">
            {convName}
          </DialogTrigger>
          <DialogContent className="text-lg font-medium flex-1">
            <DialogTitle className="text-lg font-medium  text-center flex-1">
              {convName}
            </DialogTitle>
            {conversation.type === "group" && <h2>Participants</h2>}
            {conversation.type === "group" &&
              conversation.participants.map((participant) => (
                <div
                  className="font-sm text-zinc-500 mr-2 flex justify-between"
                  key={participant._id}
                >
                  <span>
                    {participant.firstName} {participant.lastName}
                  </span>
                  <span>
                    {conversation.createdBy._id === participant._id && "Admin"}
                  </span>
                </div>
              ))}
            <DialogFooter>
              {conversation.type === "group" && isUserAdmin && (
                <Button variant={"destructive"} onClick={handleDeleteGroup}>
                  Delete Group
                </Button>
              )}
              <Button onClick={handleLeaveConversation} variant={"ghost"}>
                Leave {conversation.type === "group" ? "Group" : "Contact"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {/* justify end if user is the sender */}
          {messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              ownMessage={message.sender._id === userId}
            />
          ))}
        </div>
      </div>
      <div className="bg-background border-t px-4 py-3 rounded-3xl">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1 rounded-lg p-2 text-sm"
          />
          <Button onClick={onSubmit} size="icon">
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const Message = ({
  message,
  ownMessage,
}: {
  message: IMessage;
  ownMessage: boolean;
}) => {
  return (
    <div
      className={`flex items-start ${
        ownMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col gap-2 max-w-[75%] ${
          ownMessage ? "items-end" : "items-start"
        }`}
      >
        <div className="text-sm bg-primary text-primary-foreground p-3 rounded-lg">
          {message.text}
        </div>
        <div className="text-xs">
          {message.sender.firstName},
          <span className="text-neutral-400 ml-1">
            {formatDateTime(message.createdAt).dateTime}
          </span>
        </div>
      </div>
    </div>
  );
};
