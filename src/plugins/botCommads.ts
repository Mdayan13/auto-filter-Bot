import { Api, Bot, Context, RawApi, SessionFlavor, session } from "grammy";
import { sendWelcome } from "../controllers/hanlePrivate";
import { sendLog } from "../utils/sendLogs";
import { SessionData } from "..";
import { totalBotUser, totalPremiunUser } from "../db/storeUser";
import { totalDocumentInDb } from "../db/insertIndb";
import { getUptime } from "../utils/extracting";
import { StoreUserInDb } from "../db/storeUser";
import { botDetailsInfo, botHelp } from "../utils/constant";

export const botCommands = async (
  bot: Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>
) => {
  bot.command("start", async (ctx: Context) => {
    await StoreUserInDb(ctx);
    await sendWelcome(ctx);
  });
  bot.command("help", async (ctx) => {
    await ctx.reply(botHelp);
  });
  bot.command("details", async (ctx) => {
    const ᴀʟʟᴜsᴇʀs: number = await totalBotUser();
    const ᴘʀᴇᴍɪᴜᴍUSERS: number = await totalPremiunUser();
    const totalFiles: number = await totalDocumentInDb();
    const uptime : string= getUptime();
    const details = botDetailsInfo(ᴀʟʟᴜsᴇʀs, ᴘʀᴇᴍɪᴜᴍUSERS, totalFiles, uptime);
    await ctx.reply(details);
  });
};
