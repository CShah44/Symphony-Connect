import mongoose, { Document, models, Schema } from "mongoose";

export interface IUser extends Document {
  followers: string[];
  following: string[];
  genres: string[];
  skills: string[];
  instruments: string[];
  role: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  username: string;
}

const userSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre", default: [] }],
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill", default: [] }],
  instruments: [
    { type: Schema.Types.ObjectId, ref: "Instrument", default: [] },
  ],
  role: { type: String, enum: ["admin", "user"], default: "user" },
  photo: { type: String, default: "" },
  username: { type: String, default: "" },
});

const User = models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
