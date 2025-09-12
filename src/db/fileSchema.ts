import mongoose, { Schema, Model, Document } from "mongoose";
import "dotenv/config";
import { boolean } from "webidl-conversions";

export interface IMovie extends Document {
  isSeries?: boolean;
  fileId: string;
  fileUniquId: string;
  fileName: string;
  size: number;
  thumbnail: string;
  thumbnailUrl?: string;
  quality?: string;
  duration?: number;
  season?:number,
  episode?: number,
  genre?: string[];
  movieUrl?: string;
  year?: number | null;
  languages?: string[];
}

const movieSchema: Schema<IMovie> = new Schema({
  isSeries: {type: Boolean, default: false},
  fileId: { type: String,require: true },
  fileUniquId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  size: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number },
  quality: {type: String},
  movieUrl: { type: String },
  season: {type: Number, default: 0},
  episode:{type: Number, default: 0},
  genre: { type: [String] ,default: "Unknown"},
  year: { type: Number },
  languages: { type: [String], default: [] },
});

export const Movie: Model<IMovie> = mongoose.model<IMovie>(
  "Movie",
  movieSchema
);
