import { Document, Schema, model, models } from "mongoose";

export interface IGenre extends Document {
  _id: string;
  name: string;
}

export interface ISkill extends Document {
  _id: string;
  name: string;
}

export interface IInstrument extends Document {
  _id: string;
  name: string;
}

export interface IFavoriteArtist extends Document {
  _id: string;
  name: string;
}

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const skillSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const instrumentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const favoriteArtist = new Schema({
  name: { type: String, required: true },
});

export const Genre = models?.Genre || model<IGenre>("Genre", genreSchema);
export const Instrument =
  models?.Instrument || model<IInstrument>("Instrument", instrumentSchema);
export const Skill = models?.Skill || model<ISkill>("Skill", skillSchema);
export const FavoriteArtist =
  models?.FavoriteArtist ||
  model<IFavoriteArtist>("FavoriteArtist", favoriteArtist);
