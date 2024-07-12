import mongoose, { Schema, Document, models } from "mongoose";

export interface IPost extends Document {
  _id: string;
  postedBy: string; // ObjectId, reference to User
  type: "Opportunity" | "Event" | "Post";
  text: string;
  imageUrls?: string[];
  tags: string[];
  likes: string[]; // ObjectId, reference to User
  comments?: IComment[];
  repost?: {
    originalPostedBy: string; // ObjectId, reference to User
    originalPostId: string; // ObjectId, reference to Post
  };
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IPostFeed extends Document {
  _id: string;
  postedBy: {
    _id: string;
    username: string;
    photo: string;
  }; // ObjectId, reference to User
  type: "Opportunity" | "Event" | "Post";
  text: string;
  imageUrls: string[];
  tags: string[];
  likes: string[]; // ObjectId, reference to User
  comments: IComment[];
  repost?: {
    originalPostedBy: string; // ObjectId, reference to User
    originalPostId: string; // ObjectId, reference to Post
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  userId: string; // ObjectId, reference to User
  text: string;
  username: string;
  userProfilePic: string;
}

const postSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Opportunity", "Event", "Post"],
      default: "Post",
    },
    text: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
          default: "",
        },
      },
    ],
    repost: {
      originalPostedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      originalPostId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || mongoose.model("Post", postSchema);

export default Post;
