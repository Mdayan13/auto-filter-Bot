import mongoose, { Schema, Model, Document } from "mongoose";
import "dotenv/config";

export interface IMovie extends Document {
  fileId: string;
  fileUniquId: string;
  fileName: string;
  size: number;
  thumbnail: string;
  thumbnailUrl?: string;
  duration?: number;
  genre?: string[];
  movieUrl?: string;
  year?: number | null;
  languages?: string[];
}

const movieSchema: Schema<IMovie> = new Schema({
  fileId: { type: String,require: true },
  fileUniquId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  size: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number },
  movieUrl: { type: String },
  genre: { type: [String] ,default: "Unknown"},
  year: { type: Number },
  languages: { type: [String], default: [] },
});

export const Movie: Model<IMovie> = mongoose.model<IMovie>(
  "Movie",
  movieSchema
);
