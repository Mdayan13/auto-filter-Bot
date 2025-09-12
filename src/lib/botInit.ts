import { Api, Bot, Context, MemorySessionStorage, RawApi, SessionFlavor, session } from "grammy";
import { sendWelcome } from "../controllers/hanlePrivate";
import { sendLog } from "../utils/sendLogs";
import { SessionData } from "..";
import { config } from "../config";
import axios from "axios";
import dns from "dns";
import { reverse } from "dns/promises";
export const sertUpHandlers = async (
  bot: Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>
) => {
  // bot.init();
  // const { data } = await axios.get("https://api.ipify.org?format=json");
  // const ip: string= data.ip;
  // const hostNames = await reverse(ip)
  // console.log(hostNames[0])
  // if(config.NODE_ENV === "development"){
  //   bot.api.setWebhook(`${config.url}/bot${config.token}`);
  // }else{

  // }
  try {
    bot.use(
      session(
        {
        storage: new MemorySessionStorage(),
        initial: (): SessionData => {
          return {
            movieName: undefined,
            messageId: undefined,
            chatId: undefined,
            availableSeries: undefined,
            availQuality: undefined,
            avalLangs: undefined,
            avalYear: undefined,
          };
        },
      })
    );
  } catch (err: any) {
    console.error("🚨 Session setup failed:", err);
    await sendLog(`🚨 Session setup failed: ${err.message}`);
  }

  bot.catch(async (err) => {
    console.error("🚨 Bot error:", err);
    await sendLog(`🚨 Bot error: ${err.message}`);

    // Don't crash on API errors
    if (err.message.includes("429")) {
      console.log("⏳ Rate limited, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  });
};
