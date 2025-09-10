import {
  deleteMessage,
  deleteVidoes,
  sendLog,
  sendmessage,
} from "../utils/sendLogs.js";
import { insertInDb, sendInsertResult } from "../db/insertIndb.js";
import { Bot, Context } from "grammy";
import { Message, Video } from "grammy/types";
type batchItem = {
    msg: Message,
    videos:Video
}
let batch: batchItem[] = [];
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_TIMEOUT = 1500;

export const manageDbChannel = async (cheelpost: Message) => {
  if (cheelpost.video) {
    channelVideo(cheelpost, cheelpost.video);
  }
};

export const channelVideo = async (msg: Message, videos: Video) => {
  batch.push({msg, videos});
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    let succeed = 0;
    let failed = 0;
    let duplicate = 0;
    const result = await Promise.all(
      batch.map(({msg, videos}) => insertInDb(msg, videos))
    );
    // console.log("that's true boy", result);
    /**
     * it return is @ReturnOfPromise
     */
    let fileIds: number[] = [];
    result.forEach((item) => {
      if (item.status === "failed") failed++;
      if (item.status === "duplicate") {
        if (!item.messageId) {
          sendLog("an error in code while chasing for fileIDS at linr 34 in ");
          return;
        }
        duplicate++;
        fileIds.push(item.messageId);
      }
      if (item.status === "success") succeed++;
    });
    await sendInsertResult(result.length, succeed, duplicate, failed);
    if (fileIds.length > 0) {
      await deleteVidoes(fileIds);
    }
    batch = [];
    debounceTimer = null;
  }, DEBOUNCE_TIMEOUT);
};
