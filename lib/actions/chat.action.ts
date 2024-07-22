"use server";

import { revalidatePath } from "next/cache";
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
  type: string,
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
      type: type,
    });

    revalidatePath("/chat");

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

    const conversation: IConversation | null = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const newMessage = await Message.create({
      conversation: conversationId,
      text,
      photos,
      sender: userId,
    });

    const populatedMessage = await Message.findById(newMessage._id)
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

    conversation!.lastMessage = {
      text: populatedMessage.text,
      sender: populatedMessage.sender.firstName,
      hasPhotos: populatedMessage.photos.length > 0,
    };

    await conversation.save();

    await pusherServer.trigger(conversationId, "new-message", populatedMessage);

    return JSON.parse(JSON.stringify(populatedMessage));
  } catch (error) {
    console.log(error);
    throw new Error("Could not send the message in database");
  }
};

export const verifyContact = async (userId: string, otherUserId: string) => {
  try {
    await connect();

    const conversation: IConversation | null = await Conversation.findOne({
      type: "contact",
      participants: { $all: [userId, otherUserId] },
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

    return JSON.parse(JSON.stringify(conversation));
  } catch (error) {
    console.log(error);
    throw new Error("Could not check if conversation exists in database");
  }
};

export const sendJamRequest = async (userId: string, otherUserId: string) => {
  try {
    await connect();

    // check if conversation exists
    const conversation = await verifyContact(userId, otherUserId);

    if (conversation) {
      // send message to conversation
      const message = await sendMessage(
        conversation._id,
        "Hey! I would like to jamm with you! Hope we connect soon!",
        userId
      );

      await conversation.save();
    } else {
      // create conversation
      const newConversation = await createConversation(
        [userId, otherUserId],
        "Hey! I would like to jamm with you! Hope we connect soon!",
        "contact"
      );
      // send message to conversation
      const message = await sendMessage(
        newConversation._id,
        "Hey! I would like to jamm with you! Hope we connect soon!",
        userId
      );
    }

    return JSON.parse(JSON.stringify({ message: "JAMM! request sent" }));
  } catch (error) {
    // console.log(error);
    throw new Error("Could not send the JAM request in database");
  }
};
