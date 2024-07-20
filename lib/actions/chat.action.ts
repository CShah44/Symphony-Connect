"use server";

import { connect } from "../database";
import Conversation, {
  IConversation,
} from "../database/models/conversation.model";
import Message, { IMessage } from "../database/models/message.model";
import User from "../database/models/user.model";
import { pusherServer } from "../pusher/pusherServer";

export const getUserConversations = async (userId: string) => {
  try {
    await connect();

    const conversations: IConversation[] | null = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        model: User,
        select: "firstName lastName photo username",
      })
      .populate({
        path: "createdBy",
        model: User,
        select: "firstName lastName photo username",
      });

    return JSON.parse(JSON.stringify(conversations));
  } catch (error) {
    throw new Error("Could not get the user conversations in database");
  }
};

export const createConversation = async (
  participants: string[],
  groupName: string,
  groupPhoto?: string
) => {
  try {
    await connect();

    if (participants.length < 2)
      throw new Error("At least 2 participants required");

    const conversation = await Conversation.create({
      participants,
      groupName: groupName,
      groupPhoto: groupPhoto || "",
      createdBy: participants[0],
    });

    return JSON.parse(JSON.stringify(conversation));
  } catch (error) {
    throw new Error("Could not create the conversation in database");
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    await connect();

    const conversation: IConversation | null = await Conversation.findById(
      conversationId
    )
      .populate({
        path: "participants",
        model: User,
        select: "firstName lastName photo username",
      })
      .populate({
        path: "createdBy",
        model: User,
        select: "firstName lastName photo username",
      });

    return JSON.parse(JSON.stringify(conversation));
  } catch (error) {
    throw new Error("Could not get the conversation in database");
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    await connect();

    const messages: IMessage[] | null = await Message.find({
      conversation: conversationId,
    })
      .populate({
        path: "sender",
        model: User,
        select: "firstName lastName photo username",
      })
      .populate({
        path: "conversation",
        model: Conversation,
        select: "groupName groupPhoto",
      })
      .populate({
        path: "conversation.createdBy",
        model: User,
        select: "firstName lastName photo username",
      })
      .populate({
        path: "conversation.participants",
        model: User,
        select: "firstName lastName photo username",
      });

    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    throw new Error("Could not get the messages in database");
  }
};

export const sendMessage = async (
  conversationId: string,
  text: string,
  userId: any,
  photos?: string[]
) => {
  try {
    await connect();

    const newMessage = new Message({
      conversation: conversationId,
      text,
      photos,
      sender: userId,
    });

    console.log(newMessage);

    pusherServer.trigger(conversationId, "new-message", newMessage);

    return JSON.parse(JSON.stringify(newMessage));
  } catch (error) {
    console.log(error);
    throw new Error("Could not send the message in database");
  }
};
