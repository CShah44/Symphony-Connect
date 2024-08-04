// create post
"use server";

import { revalidatePath } from "next/cache";
import { connect } from "../database";
import Post, { IPost, IPostFeed } from "../database/models/post.model";
import User, { IUser } from "../database/models/user.model";
import { recommendedPosts } from "./utility.action";

export async function createPost(post: {
  text: string;
  type: String;
  imageUrls: String[];
  eventDate: Date | null;
  id: any;
  eventTitle: string | "";
}) {
  try {
    await connect();

    const newPost = await Post.create({
      text: post.text,
      type: post.type,
      imageUrls: post.imageUrls,
      eventDate: post.eventDate,
      postedBy: post.id,
      eventTitle: post.eventTitle,
    });

    revalidatePath("/feed");
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    console.log(error);
    throw new Error("Could not post");
  }
}

export async function getPosts() {
  try {
    await connect();
    const posts: IPostFeed[] | null = await Post.find()
      .populate({
        path: "postedBy",
        model: User,
        select: "photo username",
      })
      .populate({
        path: "repost.originalPostedBy",
        model: User,
        select: "photo username",
      })
      .sort({ createdAt: -1 });

    const recommendations = await recommendedPosts(posts);

    return JSON.parse(JSON.stringify(recommendations));
  } catch (error) {
    console.log(error);
    throw new Error("Could not fetch the posts!");
  }
}

export async function getPostById(id: string) {
  try {
    await connect();
    const post = await Post.findById(id)
      .populate({
        path: "postedBy",
        model: User,
        select: "photo username",
      })
      .populate({
        path: "repost.originalPostedBy",
        model: User,
        select: "photo username",
      });
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    throw new Error("Could not fetch the post!");
  }
}

export async function deletePostById(postId: string) {
  try {
    await connect();
    await Post.findByIdAndDelete(postId);

    revalidatePath("/feed");
    return JSON.parse(JSON.stringify({ message: "Post deleted successfully" }));
  } catch (error) {
    throw new Error("Could not delete the post!");
  }
}

export async function likeUnlike(postId: string, userId: any, path: string) {
  try {
    await connect();

    const post = await Post.findById(postId);
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //Unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      return JSON.parse(JSON.stringify({ message: "Post unliked!" }));
    } else {
      //Like
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });

      return JSON.parse(JSON.stringify({ message: "Post liked!" }));
    }
  } catch (error) {
    throw new Error("Could not like/unlike the post!");
  }
}

export async function getUserPosts(userId: any) {
  try {
    await connect();
    const posts = await Post.find({ postedBy: userId })
      .populate({
        path: "postedBy",
        model: User,
        select: "photo username",
      })
      .populate({
        path: "repost.originalPostedBy",
        model: User,
        select: "photo username",
      })
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    throw new Error("Could not fetch the posts!");
  }
}

export async function addComment({
  postId,
  userId,
  text,
}: {
  postId: string;
  userId: any;
  text: string;
}) {
  try {
    await connect();
    const post = await Post.findById(postId);
    const user: IUser | null = await User.findById(userId);

    if (!post || !user) {
      throw new Error("Could not find the post or user");
    }

    const comment = {
      text,
      userId: user._id,
      username: user.username,
      userProfilePic: user.photo,
    };

    await Post.updateOne({ _id: postId }, { $push: { comments: comment } });

    await post.save();
    return JSON.parse(JSON.stringify(comment));
  } catch (error) {
    throw new Error("Could not add comment to the post!");
  }
}

export async function repost(postId: string, repostedBy_UserId: any) {
  try {
    if (!repostedBy_UserId || !postId)
      throw new Error("Required parameters missing");

    await connect();
    const ogPost: IPost | null = await Post.findById(postId);
    const repostedBy = await User.findById(repostedBy_UserId);
    if (!ogPost || !repostedBy) {
      throw new Error("Could not find the post or user");
    }

    const newPost: IPost | null = await Post.create({
      text: ogPost.text,
      imageUrls: ogPost.imageUrls,
      type: ogPost.type,
      postedBy: repostedBy_UserId,
      comments: [],
      likes: [],
      repost: {
        originalPostedBy: ogPost.postedBy,
        originalPostId: ogPost._id,
      },
    });

    await newPost?.populate({
      path: "postedBy",
      model: User,
      select: "photo username",
    });

    await newPost?.populate({
      path: "repost.originalPostedBy",
      model: User,
      select: "photo username",
    });

    revalidatePath("/feed");
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    throw new Error("Could not repost the post!");
  }
}
