import { Schema, model, Types, models } from "mongoose";

export interface IStory {
  _id: string;
  postedBy: {
    _id: string;
    username: string;
    photo: string;
    firstName: string;
  };
  images?: string[];
  createdAt: Date;
  text: string;
}

const StorySchema = new Schema(
  {
    postedBy: { type: Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Story = models?.Story || model("Story", StorySchema);
