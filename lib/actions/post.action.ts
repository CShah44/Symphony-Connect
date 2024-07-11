// create post
"use server";

import { connect } from "../database";
import Post, { IPost } from "../database/models/post.model";
import User from "../database/models/user.model";

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
