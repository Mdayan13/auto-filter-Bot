import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import dns from "dns";
import express from "express";
import { config } from "./config.js";
import { axiosAdapter } from "./lib/adaptarApi.js";
import { Context, RawApi, Api, Bot, SessionFlavor } from "grammy";
import { sertUpHandlers } from "./lib/botInit.js";
import { sendLog } from "./utils/sendLogs.js";
import { connectDb } from "./lib/mongoDb.js";
import { botCommands } from "./plugins/botCommads.js";
import { botEvents } from "./plugins/botEvents.js";
import { searchIndexex } from "./db/searchIndex.js";
import { staticBotCallback } from "./plugins/botStaticCallbackquery.js";
import { dynamicBotQuery } from "./plugins/botDynamicCallbackQuery.js";
export interface SessionData {
  movieName: undefined | string;
  messageId: undefined | number;
  chatId: undefined | number;
  availableSeries: number[]| undefined;
  avalLangs: string[] | undefined;
  availQuality: string[] | undefined;
  avalYear: number[] | undefined;
}
dns.setDefaultResultOrder("ipv4first");
configDotenv({ path: ".env" });
// const app = express();
// app.use(express.json());
export const mongoURI = process.env.MONGO_URI;

export const bot = new Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>(
  config.token
);
// this bot run using telegram pollingmethos  so web hook is closed other wise webhook is better 
// app.post(`/bot${config.token}`, async (req, res) => {
//   const timeout = setTimeout(() => {
//     console.error("⏰ Webhook timeout");
//     res.sendStatus(408);
//   }, 20000);
//   try {
//     await bot.handleUpdate(req.body);
//     clearTimeout(timeout);
//     res.sendStatus(200);
//   } catch (err: any) {
//     clearTimeout(timeout);
//     console.error("🚨 Webhook error:", err);
//     await sendLog(`🚨 Webhook error: ${err.message}`);
//     if (err.message.includes("400") || err.message.includes("403")) {
//       console.log("this is not my mistake i won't agree");
//       res.sendStatus(200);
//     } else {
//       console.log("I giveUp at this Moment");
//       res.sendStatus(500);
//     }
//   }
// });

bot.api.config.use(async (prev, method, payload) => {
  return axiosAdapter(method, payload, config.token);
});


// Tell Telegram where to POST

// boot
sertUpHandlers(bot);
botCommands(bot);
botEvents(bot);
staticBotCallback(bot);
dynamicBotQuery(bot);
connectDb()


setInterval(() => {
  const memUsage = process.memoryUsage();
  // rss is the memory that is alocate to your process for os
  // heap used is te memory
  //heap total is the memory allocated to your javascript V8 Engine
  const memMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024), //here i am converting ram in memory
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    hapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
  };
  if (memMB.heapUsed > 300) {
    sendLog(`🚨 High memory usage: ${JSON.stringify(memMB)}`);
  }
  console.log(`Meoey uaage per % min is ${memMB.heapUsed}`);
}, 5 * 60 * 1000);

// process.on("SIGINT", async () => {
//   console.log(
//     "🛑 SIGTERM received, shutting down because soome try to interupt te server by pressing ctrl + c or whatever "
//   );
//   await sendLog(
//     "🛑 SIGTERM received, shutting down because soome try to interupt te server by pressing ctrl + c or whatever"
//   );
//   await mongoose.connection.close();
//   process.exit(0);
// });

process.on("SIGTERM", async () => {
  console.log(
    "🛑 SIGINT received, any service is calling for shutDown like any container "
  );
  await sendLog(
    "🛑 SIGINT received, any service is calling for shutDown like any process container "
  );
  await mongoose.connection.close();
  process.exit(0);
});

process.on("unhandledRejection", async (reason, promise) => {
  console.error(`💀 unhandled Rejection at:, ${promise} because of ${reason}`);
  await sendLog(`💀 unhandled Rejection at:, ${promise} because of ${reason}`);
});
bot.start()
