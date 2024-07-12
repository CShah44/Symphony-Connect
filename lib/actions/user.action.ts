"use server";

import { revalidatePath } from "next/cache";
import { connect } from "../database";
import User from "../database/models/user.model";

export async function getUserById(userId: any) {
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
    const user = await User.findByIdAndUpdate(
      data.userId,
      {
        genres: data.genres,
        instruments: data.instruments,
        skills: data.skills,
        favoriteArtists: data.favoriteArtists,
        bio: data.bio,
      },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found");
    }

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

export async function followUnfollow(userId: any, userTarget: any) {
  try {
    if (!userId || !userTarget) throw new Error("User not found");

    await connect();
    const user = await User.findById(userId);

    const isFollowing = user.following.includes(userTarget);
    console.log(isFollowing, userTarget, userId);

    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { following: userTarget },
      });
      await User.findByIdAndUpdate(userTarget, {
        $pull: { followers: userId },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { following: userTarget },
      });
      await User.findByIdAndUpdate(userTarget, {
        $push: { followers: userId },
      });
    }

    return JSON.parse(
      JSON.stringify({ message: "Followed/Unfollowed successfully" })
    );
  } catch (error) {
    console.log(error);
    throw new Error("Could not follow/unfollow the user!");
  }
}
