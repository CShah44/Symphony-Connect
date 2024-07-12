// create post
"use server";

import { revalidatePath } from "next/cache";
import { connect } from "../database";
import Post, { IPost } from "../database/models/post.model";
import User, { IUser } from "../database/models/user.model";
import { redirect } from "next/navigation";

export async function createPost(post: {
  text: string;
  type: String;
  imageUrls: String[];
  id: any;
}) {
  try {
    await connect();

    const newPost = await Post.create({
      text: post.text,
      type: post.type,
      imageUrls: post.imageUrls,
      postedBy: post.id,
    });

    revalidatePath("/feed");
    redirect("/feed");
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    console.log(error);
    throw new Error("Could not post");
  }
}

export async function getPosts() {
  try {
    await connect();
    const posts = await Post.find().populate({
      path: "postedBy",
      model: User,
      select: "photo username",
    });

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.log(error);
    throw new Error("Could not fetch the posts!");
  }
}

export async function getPostById(id: string) {
  try {
    await connect();
    const post = await Post.findById(id);
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
    const posts = await Post.find({ postedBy: userId }).populate({
      path: "postedBy",
      model: User,
      select: "photo username",
    });
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

export async function repost(postId: string, repostedBy_UserId: string) {
  try {
    await connect();
    const ogPost: IPost | null = await Post.findById(postId);
    const repostedBy = await User.findById(repostedBy_UserId);
    if (!ogPost || !repostedBy) {
      throw new Error("Could not find the post or user");
    }

    const newPost: IPost | null = await Post.create({
      ...ogPost,
      postedBy: repostedBy_UserId,
      comments: [],
      likes: [],
      repost: {
        originalPostedBy: ogPost.postedBy,
        originalPostId: ogPost._id,
      },
    });

    revalidatePath("/feed");
    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    throw new Error("Could not repost the post!");
  }
}
