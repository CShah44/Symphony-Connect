"use server";

import { revalidatePath } from "next/cache";
import { IStory, Story } from "../database/models/story.model";
import User from "../database/models/user.model";
import { connect } from "../database";

export const createStory = async (story: {
  text: string;
  id: any;
  imageUrls?: string[];
}): Promise<IStory> => {
  try {
    await connect();
    const newStory = await Story.create({
      text: story.text,
      postedBy: story.id,
      images: story.imageUrls || [],
    });

    revalidatePath("/feed");

    return JSON.parse(JSON.stringify(newStory));
  } catch (error) {
    throw new Error("Could not create the story!");
  }
};

export const getStories = async (): Promise<IStory[]> => {
  try {
    await connect();
    const stories = await Story.find().populate({
      path: "postedBy",
      model: User,
      select: "firstName photo username",
    });
    return JSON.parse(JSON.stringify(stories));
  } catch (error) {
    throw new Error("Could not fetch the stories!");
  }
};

export const deleteStory = async (storyId: string) => {
  try {
    await connect();
    const deletedStory = await Story.findByIdAndDelete(storyId);

    revalidatePath("/feed");
    return JSON.parse(JSON.stringify(deletedStory));
  } catch (error) {
    throw new Error("Could not delete the story!");
  }
};
