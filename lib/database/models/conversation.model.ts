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
}

// no need to store messages as an array here
const conversationSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String, default: "" },
    groupPhoto: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Conversation =
  models?.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
