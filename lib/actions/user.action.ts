"use server";

import { revalidatePath } from "next/cache";
import { connect } from "../database";
import User from "../database/models/user.model";

export async function getUserById(userId: string) {
  try {
    await connect();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Could not get the user in database");
  }
}

export async function createUser(user: any) {
  try {
    await connect();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    throw new Error("Could not create the user in database");
  }
}

export async function updateUser(clerkId: string, user: any) {
  try {
    await connect();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    throw new Error("Could not update the user in database");
  }
}

export async function updateMusicProfile(data: {
  genres: string[];
  instruments: string[];
  skills: string[];
  favoriteArtists: string[];
  bio: string;
  userId: any;
}) {
  try {
    const user = await User.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.save();

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connect();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    throw new Error("Could not delete the user in database");
  }
}

// todo check
export async function followUnfollow(userId: string, userTarget: string) {
  try {
    await connect();
    const user = await User.findById(userId);
    const userTargetData = await User.findById(userTarget);

    const index = userTargetData.following.findIndex(
      (id: string) => id === userId
    );

    if (index === -1) {
      user.following.push(userTarget);
      userTargetData.followers.push(userId);
    } else {
      user.following = user.following.filter((id: string) => id !== userTarget);
      userTargetData.followers = userTargetData.followers.filter(
        (id: string) => id !== userId
      );
    }
    await user.save();
    await userTargetData.save();
    return JSON.parse(
      JSON.stringify({ message: "Followed/Unfollowed successfully" })
    );
  } catch (error) {
    throw new Error("Could not follow/unfollow the user!");
  }
}
