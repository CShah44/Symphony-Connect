"use server";

import User, { IUser } from "../database/models/user.model";
import { sentenceSimilarity, imageToText } from "@huggingface/inference";
import { getCurrentUser, getUsers } from "./user.action";
import { IPostFeed } from "../database/models/post.model";

export const getMostPopularGenres = async () => {
  try {
    const results: any[] = await User.aggregate([
      { $unwind: "$genres" }, // Deconstruct the genres array
      { $group: { _id: "$genres", count: { $sum: 1 } } }, // Group by genre and count
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 3 }, // Limit to the top results
    ]);

    return JSON.parse(JSON.stringify(results.map((result: any) => result._id))); // Return the most popular genre
  } catch (error) {
    console.error("Error getting most popular genre:", error);
    throw new Error("Error getting most popular genre");
  }
};

export const getMostPopularArtists = async () => {
  try {
    const results: any[] = await User.aggregate([
      { $unwind: "$favoriteArtists" }, // Deconstruct the favoriteArtists array
      { $group: { _id: "$favoriteArtists", count: { $sum: 1 } } }, // Group by favoriteArtists and count
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 3 }, // Limit to the top results
    ]);

    return JSON.parse(JSON.stringify(results.map((result: any) => result._id))); // Return the most popular artist
  } catch (error) {
    console.error("Error getting most popular artist:", error);
    throw new Error("Error getting most popular artist");
  }
};

// todo caching here
export async function calculateProfileMatch(user1: IUser, user2: IUser) {
  if (!user1 || !user2) return 0;

  const profile1: any = `${user1.genres.join(" ")} ${user1.skills.join(
    " "
  )} ${user1.instruments.join(" ")} ${user1.favoriteArtists.join(" ")} ${
    user1.bio
  }`;
  const profile2: any = `${user2.genres.join(" ")} ${user2.skills.join(
    " "
  )} ${user2.instruments.join(" ")} ${user2.favoriteArtists.join(" ")} ${
    user2.bio
  }`;

  try {
    const similarity = await sentenceSimilarity({
      accessToken: process.env.HF_TOKEN,
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: {
        source_sentence: profile1,
        sentences: [profile2],
      },
    });

    const score = Math.round(similarity[0] * 100);

    return JSON.parse(JSON.stringify(score));
  } catch (error) {
    console.log(error);
    throw new Error("Error calculating profile match");
  }
}

export async function generateSimilarityScore(
  postContent: string,
  userPreferences: string
) {
  if (!postContent || !userPreferences) return 0;

  try {
    const similarity = await sentenceSimilarity({
      accessToken: process.env.HF_TOKEN,
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: {
        source_sentence: postContent,
        sentences: [userPreferences],
      },
    });

    const score = Math.round(similarity[0] * 100);

    return JSON.parse(JSON.stringify(score));
  } catch (error) {
    console.log(error);
    throw new Error("Error calculating profile match");
  }
}

// now we need to get the recommended users based on the user's profile
// we will use the calculateProfileMatch function to calculate the similarity between the user's profile and the recommended users
// and then sort the recommended users based on the similarity score
export const getRecommendedUsers = async (query?: string, tag?: string) => {
  try {
    let cachedRecommendedUsers: IUser[] = (global as any).recommendedUsers;

    if (cachedRecommendedUsers?.length > 0) {
      return JSON.parse(JSON.stringify(cachedRecommendedUsers));
    } else {
      const users: IUser[] = await getUsers(query, tag);
      const currentUser: IUser = await getCurrentUser();

      let nonMatchingUsers: IUser[] = [];
      let recommendedUsers: IUser[] = [];

      for (const user of users) {
        const similarity = await calculateProfileMatch(user, currentUser);
        user.similarity = similarity;

        if (similarity > 60) {
          recommendedUsers.push(user);
        } else {
          nonMatchingUsers.push(user);
        }
      }

      cachedRecommendedUsers = (global as any).recommendedUsers = [
        ...recommendedUsers,
        ...nonMatchingUsers,
      ];
      return JSON.parse(JSON.stringify(cachedRecommendedUsers));
    }
  } catch (error) {
    throw new Error("Error calculating profile match");
  }
};

export const generateTextFromImage = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const text = await imageToText({
      accessToken: process.env.HF_TOKEN,
      model: "Salesforce/blip-image-captioning-large",
      data: blob,
    });

    return JSON.parse(JSON.stringify(text));
  } catch (error) {
    console.log(error);
    throw new Error("Could not generate text from image!");
  }
};

export const recommendedPosts = async (posts: IPostFeed[]) => {
  try {
    let cachedRecommendedPosts: IPostFeed[] = (global as any).recommendedPosts;

    if (
      cachedRecommendedPosts?.length > 0 &&
      cachedRecommendedPosts?.length === posts.length
    ) {
      return JSON.parse(JSON.stringify(cachedRecommendedPosts));
    } else {
      const user: IUser = await getCurrentUser();
      const recommendedPosts: IPostFeed[] = [];
      const unrelatedPosts: IPostFeed[] = [];

      for (const post of posts) {
        let userPreferences = `
      ${user.genres.join(" ")}
      ${user.skills.join(" ")}
      ${user.instruments.join(" ")}
      ${user.favoriteArtists.join(" ")}
    `;

        let postContent = `${post.text} ${post.type}`;

        if (post.imageUrls?.length > 0) {
          for (const imageUrl of post.imageUrls) {
            const imageText = await generateTextFromImage(imageUrl);
            postContent += ` ${imageText}`;
          }
        }

        const score = await generateSimilarityScore(
          postContent,
          userPreferences
        );

        if (score > 60) {
          recommendedPosts.push(post);
        } else {
          unrelatedPosts.push(post);
        }
      }

      cachedRecommendedPosts = (global as any).recommendedPosts = [
        ...recommendedPosts,
        ...unrelatedPosts,
      ];
    }

    return JSON.parse(JSON.stringify(cachedRecommendedPosts));
  } catch (error) {
    console.error("Error getting recommended posts:", error);
    throw new Error("Error getting recommended posts");
  }
};
