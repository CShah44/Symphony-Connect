"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { IMessage } from "@/lib/database/models/message.model";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient";
import { Input } from "../ui/input";
import { sendMessage } from "@/lib/actions/chat.action";
import { toast } from "../ui/use-toast";

export default function MessageContainer({
  messages: preLoadedMessages,
  userId,
  conversationId,
}: {
  conversationId: string;
  userId?: string;
  messages: IMessage[];
}) {
  const [messages, setMessages] = useState(preLoadedMessages);

  const inputRef = useRef<HTMLInputElement>(null);

  console.log(messages);

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
      });
    }
  }

  return (
    <div className="flex flex-col border h-screen sm:h-[80vh] w-full md:w-10/12 lg:w-8/12 mx-auto rounded-3xl">
      <div className="border-slate-300 border rounded-3xl w-full p-4 flex items-center gap-4 mx-auto">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2"
          prefetch={false}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
        <h2 className="text-lg font-medium  text-center flex-1">Message</h2>
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
      className={`flex items-start gap-4 ${
        ownMessage ? "justify-end" : "justify-start"
      }`}
    >
      <Image
        src={message.sender.photo}
        alt={message.sender.firstName}
        width={10}
        height={10}
        className="rounded-full"
      />
      <div>
        {message.sender.firstName} {message.sender.lastName}
      </div>
      <div className="grid gap-1 bg-primary text-primary-foreground p-3 rounded-lg max-w-[75%]">
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};
