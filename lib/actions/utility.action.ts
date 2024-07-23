import User, { IUser } from "../database/models/user.model";
import { sentenceSimilarity } from "@huggingface/inference";
import { getCurrentUser, getUsers } from "./user.action";

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

// now we need to get the recommended users based on the user's profile
// we will use the calculateProfileMatch function to calculate the similarity between the user's profile and the recommended users
// and then sort the recommended users based on the similarity score
export const getRecommendedUsers = async (query?: string, tag?: string) => {
  try {
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

    return JSON.parse(
      JSON.stringify([...recommendedUsers, ...nonMatchingUsers])
    );
  } catch (error) {
    throw new Error("Error calculating profile match");
  }
};
