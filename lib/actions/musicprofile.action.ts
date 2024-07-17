"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { connect } from "../database";
import {
  Genre,
  Instrument,
  Skill,
  FavoriteArtist,
} from "../database/models/musicprofile.model";

export const addSkillToDB = async (skill: string) => {
  try {
    await connect();

    const res = await Skill.create({
      name: skill.toLowerCase(),
    });

    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    throw new Error("Could not add that skill to DB");
  }
};

export const addInstrumentToDB = async (instrument: string) => {
  try {
    await connect();

    const res = await Instrument.create({
      name: instrument.toLowerCase(),
    });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    throw new Error("Could not add that instrument to DB");
  }
};

export const addGenreToDB = async (genre: string) => {
  try {
    await connect();
    const res = await Genre.create({
      name: genre.toLowerCase(),
    });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    throw new Error("Could not add that genre to DB");
  }
};

export const addFavoriteArtistToDB = async (artist: string) => {
  try {
    await connect();
    const res = await FavoriteArtist.create({
      name: artist.toLowerCase(),
    });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    throw new Error("Could not add that artist to DB");
  }
};

export const getOnboardData = async () => {
  try {
    await connect();
    const skills = await Skill.find();
    const instruments = await Instrument.find();
    const genres = await Genre.find();
    const artists = await FavoriteArtist.find();

    const data = {
      skills: skills.map((s) => s.name),
      instruments: instruments.map((i) => i.name),
      genres: genres.map((g) => g.name),
      favoriteArtists: artists.map((a) => a.name),
    };

    // const isOnBoarded = auth().sessionClaims?.public_metadata?.onboarded;

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    throw new Error("Could not get onboard data from DB");
  }
};

export const changeOnboardingStatus = async (status: boolean) => {
  try {
    await connect();
    clerkClient().users.updateUserMetadata(auth().userId || "", {
      publicMetadata: {
        onboarded: status,
      },
    });
  } catch (error) {
    throw new Error("Could not change onboarding status");
  }
};
