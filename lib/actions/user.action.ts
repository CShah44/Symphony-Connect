"use server";

import { revalidatePath } from "next/cache";
import { connect } from "../database";
import User, { IUser } from "../database/models/user.model";
import { auth, currentUser } from "@clerk/nextjs/server";
import Conversation, {
  IConversation,
  IParticipant,
} from "../database/models/conversation.model";

export async function getUserById(userId: any) {
  try {
    await connect();
    const user = await User.findById(userId);
    const clerkUser = await currentUser();

    if (clerkUser?.publicMetadata.onboarded === false && !user) return null;

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Could not get the user in database");
  }
}

export async function getUserFollowers(userId: string) {
  try {
    await connect();
    const followers = (
      await User.findById(userId)
        .populate("followers", "firstName lastName photo username", User)
        .select("followers")
    ).followers;

    return JSON.parse(JSON.stringify(followers));
  } catch (error) {
    throw new Error("Could not get the user in database");
  }
}

export async function getUsers(query?: string, tag?: string) {
  try {
    await connect();

    let users: IUser[];

    // filter users if query exists by matching the firstName or lastName
    // if a tag is provided, filter users by matching tag with genres, instruments, skills, or favoriteArtists

    const queryConditions = query
      ? {
          $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const tagConditions = tag
      ? {
          $or: [
            { genres: { $regex: query, $options: "i" } },
            { instruments: { $regex: query, $options: "i" } },
            { skills: { $regex: query, $options: "i" } },
            { favoriteArtists: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    // combine the query and tag conditions
    const conditions = {
      $and: [queryConditions, tagConditions],
      // write another condition that auth().userId !== to usre.clerkId
      // this will filter out the current user
      clerkId: { $ne: auth().userId },
    };

    users = await User.find(conditions);

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    throw new Error("Could not get the users in database");
  }
}

export async function createUser(user: any) {
  try {
    await connect();

    const newUser = await User.create(user);

    revalidatePath("/user/edit");
    revalidatePath("/feed");
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

    revalidatePath(`/user/${user._id}`);

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
    const userToDelete: IUser | null = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const userId = userToDelete._id;

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    // find all conversations user is a part of and delete his id from participants
    const conversations = await Conversation.find({ participants: userId });
    conversations.forEach((conversation: IConversation) => {
      conversation.participants = conversation.participants.filter(
        (participant: IParticipant) => participant._id !== userId
      );
      conversation.save();
    });

    // delete the user's id from followers and following of all other users
    const users = await User.find();
    users.forEach(async (user: IUser) => {
      if (user.following.includes(userId)) {
        user.following = user.following.filter(
          (followingId) => followingId !== userId
        );
        await user.save();
      }
      if (user.followers.includes(userId)) {
        user.followers = user.followers.filter(
          (followerId) => followerId !== userId
        );
        await user.save();
      }
    });

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

    revalidatePath("/discover");

    return JSON.parse(
      JSON.stringify({ message: "Followed/Unfollowed successfully" })
    );
  } catch (error) {
    console.log(error);
    throw new Error("Could not follow/unfollow the user!");
  }
}

export async function getCurrentUser() {
  try {
    await connect();
    const user: IUser | null = await User.findById(
      auth().sessionClaims?.public_metadata?.userId
    );
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Could not get the user in database");
  }
}
