// create post
"use server";

import { connect } from "../database";
import Post, { IPost } from "../database/models/post.model";
import User, { IUser } from "../database/models/user.model";

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
    return JSON.parse(JSON.stringify({ message: "Post deleted successfully" }));
  } catch (error) {
    throw new Error("Could not delete the post!");
  }
}

export async function likeUnlike(postId: string, userId: string) {
  try {
    await connect();

    const post = await Post.findById(postId);
    const index = post.likes.findIndex((id: string) => id === userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id: string) => id !== userId);
    }
    await post.save();
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    throw new Error("Could not like/unlike the post!");
  }
}

export async function addComment(postId: string, userId: string, text: string) {
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
      userProfilePic: user.photo,
    };

    post.comments.push(comment);

    await post.save();
    return JSON.parse(JSON.stringify(post));
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

    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    throw new Error("Could not repost the post!");
  }
}
