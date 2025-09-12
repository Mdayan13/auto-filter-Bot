import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

export const config = {
  monog: process.env.MONGO_URI as string,
  token: process.env.TELEGRAM_TOKEN as string,
  log: process.env.LOG_CHANNEL || -1002935436985,
  dbChannel: process.env.DB_CHANNEL || -1002977369390,
  url: process.env.WEBHOOK_URL as string,
  geminiApiKey: process.env.GEMINI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  supportGroup: process.env.SUPPORT_GROUP,
  requestChannel: process.env.REQUESTCHANNEL,
  botOwner: process.env.BOTOWNER,
};
