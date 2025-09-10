import { constNotfound, sendLog, sendmessage } from "../utils/sendLogs.js";
import { Context } from "grammy";
import { serchtheMovie } from "../plugins/filterMovie.js";
import { sendMovies } from "../plugins/sendMoviesButton.js";
import {
  BioImageUri,
  inlineButtonForWelcome,
  visitInline,
} from "../utils/constant.js";
import { OwnerCaption, WelcomeCaption } from "../utils/constant.js";
export const handlePrivate = async (ctx: Context) => {
  try {
    if (ctx.message?.text) {
      await ctx.reply(`🔍 On the hunt for your movie: ${ctx.message?.text}`, {
        reply_parameters: { message_id: ctx.message.message_id },
      });
      const searchResult = await serchtheMovie(ctx.message.text);
      if (searchResult.length === 0) {
        return constNotfound(ctx.message.chat.id, ctx.message.text);
      }
      await sendMovies(ctx, searchResult).catch(async (err) => {
        console.error("🚨 Failed to send movies:", err);
        await sendLog(`🚨 Movie display failed: ${err.message}`);
      });
    }
  } catch (err: any) {
    console.error("🚨 Private message handler error:", err);
    await sendLog(`🚨 Private handler error: ${err.message}`);
  }
};

export const sendWelcome = async (ctx: Context) => {
  ctx.replyWithPhoto(BioImageUri, {
    caption: WelcomeCaption,
    reply_markup: inlineButtonForWelcome,
  });
};

export const sendOwnerDetails = async (ctx: Context) => {
  const ownerId = 7397841456;
  const bioPhotos = await ctx.api.getUserProfilePhotos(ownerId);
  const profileID = bioPhotos.photos[0][0].file_id;
  await ctx.editMessageMedia(
    {
      type: "photo",
      media: profileID,
      caption: OwnerCaption,
    },
    {
      reply_markup: visitInline,
    }
  );
};
