import { Api, Bot, Context, RawApi, SessionFlavor, session } from "grammy";
import { manageDbChannel } from "../controllers/handleChannel";
import { handlePrivate } from "../controllers/hanlePrivate";
import { SessionData } from "..";


export const botEvents = async (
  bot: Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>
) => {
  bot.on("channel_post", async (ctx) => {
    await manageDbChannel(ctx.update.channel_post);
  });
  bot.on("message", async (ctx) => {
    await handlePrivate(ctx);
  });
  
};
