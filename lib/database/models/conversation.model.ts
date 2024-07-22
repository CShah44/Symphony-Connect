import mongoose, { Document, models, Schema } from "mongoose";

export interface IParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  photo: string;
  username: string;
}

export interface IConversation extends Document {
  _id: string;
  participants: IParticipant[];
  groupName: string;
  groupPhoto: string;
  createdBy: IParticipant;
  type: string;
  lastMessage: {
    text: string;
    sender: string;
    hasPhotos: boolean;
  };
}

// no need to store messages as an array here
const conversationSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String, default: "" },
    groupPhoto: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["group", "contact"], default: "group" },
    lastMessage: {
      text: { type: String, default: "" },
      sender: { type: String, default: "" },
      hasPhotos: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Conversation =
  models?.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
