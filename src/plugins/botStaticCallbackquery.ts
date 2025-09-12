import { Api, Bot, Context, RawApi, SessionFlavor } from "grammy";
import { SessionData } from "..";
import { sendLog } from "../utils/sendLogs";
import {
  autoForwardBot,
  autoForwardbotCaption,
  BioImageUri,
  inlineButtonForWelcome,
  premiumCaption,
  premiumInline,
  videoButtons,
  WelcomeCaption,
} from "../utils/constant";
import { sendOwnerDetails } from "../controllers/hanlePrivate";
import { filterMovie } from "./filterMovie";
import {
  sendMoviesViaQuality,
  sendMovieViaLangauges,
  sendVideoSerieses,
  sendVideosOnYear,
} from "./sendMoviDetails";

export const staticBotCallback = async (
  bot: Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>
) => {
  bot.callbackQuery(/^botOwner/, async (ctx: Context) => {
    if (!ctx.chat) {
      return;
    }
    try {
      await sendOwnerDetails(ctx);
      ctx.answerCallbackQuery();
    } catch (error) {
      ctx.reply("internal error");
      sendLog("An error while showing users INfo");
    }
  });

  bot.callbackQuery(/^premium/, async (ctx: Context) => {
    await ctx.editMessageCaption({
      caption: premiumCaption,
      reply_markup: premiumInline,
    });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/^forwordBot/, async (ctx: Context) => {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: BioImageUri,
        caption: autoForwardbotCaption,
      },
      {
        reply_markup: autoForwardBot,
      }
    );
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/^joinGroup/, async (ctx: Context) => {
    
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/^BackToProfile/, async (ctx: Context) => {
    try {
      await ctx.editMessageMedia(
        {
          type: "photo",
          media: BioImageUri,
          caption: WelcomeCaption(ctx),
        },
        {
          reply_markup: inlineButtonForWelcome,
        }
      );
      await ctx.answerCallbackQuery();
    } catch (error) {
      sendLog("an error while in callbackQuery");
    }
  });
  bot.callbackQuery(/^dowloadAndStream/, async (ctx: Context) => {
    await ctx.reply("waitsendlinlink");
    await ctx.answerCallbackQuery();
  });
  bot.callbackQuery(
    /^Languages/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      const movieNameInSession = ctx.session.movieName;
      if (!movieNameInSession) {
        console.log("Movie name Not Found in session Data");
        await ctx.answerCallbackQuery();
        return;
      }
      const languagesList = await ctx.session.avalLangs;
      if (!languagesList) {
        ctx.answerCallbackQuery("laguages List is Not avaliable");
        return;
      }
      await sendMovieViaLangauges(ctx, languagesList);
      await ctx.answerCallbackQuery();
    }
  );
  bot.callbackQuery(/^backToMenu/, async (ctx: Context) => {
    await ctx.editMessageReplyMarkup({
      reply_markup: videoButtons,
    });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(
    /^Quality/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      try {
        const movieNameInSession = ctx.session.movieName;
        if (!movieNameInSession) {
          console.log("Movie name Not Found in session Data");
          await ctx.answerCallbackQuery();
          return;
        }
        const qualityList = await ctx.session.availQuality;
        if (!qualityList) {
          ctx.answerCallbackQuery("list of quality is not avalble in sessiom");
          return;
        }
        await sendMoviesViaQuality(ctx, qualityList);
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.log("error failed to setip callbackfor Video Quality");
        ctx.answerCallbackQuery("error failed to setip callbackfor Video");
      }
    }
  );
  bot.callbackQuery(
    /^episods/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      try {
        
        const seriesNumber = await ctx.session.availableSeries;
        if (!seriesNumber) {
          await ctx.answerCallbackQuery("this is not an series ok");
          return;
        }
        await sendVideoSerieses(ctx, seriesNumber);
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.log("got an callbackError while serilizing ");
        await ctx.answerCallbackQuery("got an callbackError while serilizing ");
      }
    }
  );

  bot.callbackQuery(/^year/, async (ctx: Context & SessionFlavor<SessionData>) => {
    try {
        const yearList = await ctx.session.avalYear;
        if(!yearList){
            ctx.answerCallbackQuery("year list is not avalible for this");
            return
        }
        await sendVideosOnYear(ctx, yearList);
        await ctx.answerCallbackQuery();
    } catch (error) {
        await ctx.answerCallbackQuery("some thing went wrong with sedVideo");
    }
  });
};
