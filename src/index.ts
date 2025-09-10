import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import dns from "dns";
import express from "express";
import { config } from "./config.js";
import { axiosAdapter } from "./lib/adaptarApi.js";
import { Context, RawApi, Api, Bot, SessionFlavor } from "grammy";
import { sertUpHandlers } from "./lib/setUpBotHandlers.js";
import { sendLog } from "./utils/sendLogs.js";
import { connectDb } from "./lib/mongoDb.js";
interface SessionData {
  movieName: undefined;
}
dns.setDefaultResultOrder("ipv4first");
configDotenv({ path: ".env" });
const app = express();
app.use(express.json());
export const mongoURI = process.env.MONGO_URI;

export const bot = new Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>(
  config.token
);

app.post(`/bot${config.token}`, async (req, res) => {
  const timeout = setTimeout(() => {
    console.error("⏰ Webhook timeout");
    res.sendStatus(408);
  }, 20000);
  try {
    await bot.handleUpdate(req.body);
    clearTimeout(timeout);
    res.sendStatus(200);
  } catch (err: any) {
    clearTimeout(timeout);
    console.error("🚨 Webhook error:", err);
    await sendLog(`🚨 Webhook error: ${err.message}`);
    if (err.message.includes("400") || err.message.includes("403")) {
      console.log("this is not my mistake i won't agree");
      res.sendStatus(200);
    } else {
      console.log("I giveUp at this Moment");
      res.sendStatus(500);
    }
  }
});

bot.api.config.use(async (prev, method, payload) => {
  return axiosAdapter(method, payload, config.token);
});

bot.api.setWebhook(`${config.url}/bot${config.token}`);
// Tell Telegram where to POST

// boot
sertUpHandlers(bot);
connectDb().then(() => {
  app.listen(4000, () => {
    console.log(`🚀 API started on port 4000`);
  });
});
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

process.on("SIGINT", async () => {
  console.log(
    "🛑 SIGTERM received, shutting down because soome try to interupt te server by pressing ctrl + c or whatever "
  );
  await sendLog(
    "🛑 SIGTERM received, shutting down because soome try to interupt te server by pressing ctrl + c or whatever"
  );
  await mongoose.connection.close();
  process.exit(0);
});

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
