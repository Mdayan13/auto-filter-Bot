import { Context } from "grammy";
import { config } from "../config.js";
import { bot } from "../index.js";
import { Movie } from "../db/fileSchema.js";
import { isAllowDuplicate } from "./setting.js";
import { sendMovieWithCaption2 } from "../plugins/sendMoviDetails.js";

export const sendLog = async (message: string) => {
  console.log("sendlong log");
  await bot.api.sendMessage(config.log, message);
};
export const sendmessage = async (chatId: number, message: string) => {
  bot.api.sendMessage(chatId, message);
};
export const deleteMessage = (chatID: number, messageId: number) => {
  bot.api.deleteMessage(chatID, messageId);
};

export const constNotfound = (chatID: number, messageId: string) => {
  const notFound = `sorry🔸 moive:- ${messageId} not Found`;
  bot.api.sendMessage(chatID, messageId);
};

export const deleteVidoes = async (fileIds: number[]) => {
  if (isAllowDuplicate) {
    console.log("deleting videos");
    await bot.api.deleteMessages(config.dbChannel, fileIds);
  }
};
export const prefixName = (name: string, title?: string) => {
  return `📁 𝐅𝐢𝐥𝐞: ${title ? title + " " : ""}${name}`;
};

export const sendMovie = async (ctx: Context, fileId: string) => {
  if (!fileId) return;
  const movieDetails = await Movie.findOne({ fileUniquId: fileId });
  if (!movieDetails) {
    sendLog(`one FileId Not found trying to find from fileId ${fileId}`);
    return;
  }
  await sendMovieWithCaption2(ctx, movieDetails);
};
