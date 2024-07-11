// create post

import { connect } from "../database";
import Post from "../database/models/post.model";

export async function createPost(post: {
  text: string;
  type: String;
  imageUrls: String[];
  id: String;
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
