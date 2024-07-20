import mongoose, { Document, models, Schema } from "mongoose";
import { IConversation } from "./conversation.model";

// here the sender has to be populated
export interface IMessage extends Document {
  _id: string;
  conversation: IConversation;
  text: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    photo: string;
    username: string;
  };
  photos?: string[];
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    text: { type: String, required: true },
    photos: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

const Message =
  models?.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
