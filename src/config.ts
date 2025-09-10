import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

export const config = {
  monog: process.env.MONGO_URI as string,
  token: process.env.TELEGRAM_TOKEN as string,
  log: process.env.LOG_CHANNEL  || -1002935436985,
  dbChannel: process.env.DB_CHANNEL || -1002977369390 ,
  url: process.env.URL as string,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
console.log(config);
