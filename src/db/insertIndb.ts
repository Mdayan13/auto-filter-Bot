import { setEnvironmentData } from "worker_threads";
import { Movie } from "../schemas/fileSchema.js";
import { Message } from "grammy/types";
import {
  AiFileTitleAndGenre,
  getLanguages,
  getThubnailUrl,
  getYear,
} from "../utils/extracting.js";
import { sendLog } from "../utils/sendLogs.js";
import { Video } from "grammy/types";
import mongoose from "mongoose";
export type insertResult =
  | { status: "failed" }
  | { status: "duplicate"; messageId: number }
  | { status: "success"; messageId: number };

export const insertInDb = async (msg: Message, video: Video) => {
  try {
    if (!video) {
      console.log("🚨 Video missing required");
      return { status: "failed" };
    }
    if (!video.file_id || !video.file_name) {
      console.log("⚠️ Video object is missing required fields:", video);
      return { status: "failed" };
    }
    if (!msg || !msg.message_id) {
      console.log(
        "failed to insert Movies in Database because messageID is missing"
      );
      return { status: "failed" };
    }
    console.log("🔍 Searching for movie in database:", video.file_name);
    // check if already in db
    const existing = await Movie.findOne({ fileId: video.file_id });
    if (existing) {
      console.log("✅ Movie already in DB:", existing.fileName);
      return { status: "duplicate", messageId: msg.message_id };
    }

    // safe extract utils
    const thumbnailUrl = await getThubnailUrl(video.file_name).catch(
      () => null
    );
    const { newTitle2, genres } = await AiFileTitleAndGenre(video.file_name);

    const languages = (await getLanguages(video.file_name)) || [];
    const year = (await getYear(video.file_name)) || null;
    const duration = video.duration;

    const movieSaved = await Movie.create({
      fileId: video.file_id,
      duration,
      fileUniquId: video.file_unique_id,
      fileName: newTitle2,
      size: video.file_size || 0,
      genre: genres,
      thumbnail: video.thumbnail?.file_id || null,
      thumbnailUrl,
      languages,
      year,
    });
    if (!movieSaved) {
      console.log("failed to insert in datdabase");
      return { status: "failed" };
    }
    console.log("moviesaved Todb");
    return { status: "success", messageId: msg.message_id };
  } catch (err: any) {
    console.error("❌ Error inserting movie:", err.message);
    await sendLog(
      `❌ DB insert failed: ${err.message} | Data: ${JSON.stringify({
        video: video?.file_name,
        msgId: msg?.message_id,
      })}`
    );
    return { status: "failed" };
  }
};
export const sendInsertResult = (
  total: number,
  saved: number,
  duplicated: number,
  failed: number
) => {
  sendLog(`
    total Movie Sent:-${total}\nmovie Saved To Db:- ${saved}\nduplicated Skipped:-${duplicated}\nfailed Movie:-${failed}`);
};
