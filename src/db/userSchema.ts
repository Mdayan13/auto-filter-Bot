import mongoose, {  Model } from "mongoose";
import { boolean } from "webidl-conversions";
import { Schema } from "mongoose";
export interface userInterface {
    userId: number;
  isBot: boolean;
  firstName: string;
  lastName: string;
  userName: string;
  isPremium: boolean
}
const userSchema: Schema<userInterface> = new Schema({
  userId: { type: Number },
  isBot: { type: Boolean },
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  isPremium: {type: Boolean,default: false},
}, {timestamps: true});

export const User: Model<userInterface> = mongoose.model<userInterface>(
  "User",
  userSchema
);
