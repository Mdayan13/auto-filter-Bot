import { Api, Bot, Context, RawApi, SessionFlavor, session } from "grammy";
import { manageDbChannel } from "../controllers/handleChannel";
import {
  handlePrivate,
  sendOwnerDetails,
  sendWelcome,
} from "../controllers/hanlePrivate";
import { sendLog } from "../utils/sendLogs";

import {
  autoForwardbotCaption,
  autoForwardBot,
  BioImageUri,
  inlineButtonForWelcome,
  premiumCaption,
  premiumInline,
  WelcomeCaption,
  MovieCaption,
  videoButtons,
} from "../utils/constant";
import {
  sendMovieWithCaption,
  sendMovieWithCaption2,
} from "../plugins/sendMoviDetails";
import { Movie } from "../schemas/fileSchema";
import { sendMovies } from "../plugins/sendMoviesButton";
import { serchtheMovie } from "../plugins/filterMovie";
interface SessionData {
  movieName: undefined;
}
export const sertUpHandlers = async (
  bot: Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>
) => {
  bot.init();

try {
    bot.use(
      session({
        initial: (): SessionData => {
          return { movieName: undefined };
        },
      })
    );
} catch (err: any) {
  console.error("🚨 Session setup failed:", err);
  await sendLog(`🚨 Session setup failed: ${err.message}`);
}
  bot.command("start", async (ctx) => {
    await sendWelcome(ctx);
  });
  bot.command("help", async (ctx) => {
    await ctx.reply("display in the optoins");
  });
  bot.on("channel_post", async (ctx) => {
    await manageDbChannel(ctx.update.channel_post);
  });
  bot.on("message", async (ctx) => {
    await handlePrivate(ctx);
  });

  bot.callbackQuery(/^movies(.+)$/, async (ctx: Context) => {
    try {
      if (!ctx.callbackQuery?.data) {
        sendLog("Error: CallBackquery related");
        return;
      }
      const fileId: string = ctx.callbackQuery.data.replace("movies", "");

      if (!fileId) {
        await sendLog("🚨 Empty file ID in callback");
        await ctx.answerCallbackQuery("Invalid movie ID");
        return;
      }
      //because context @returns somethink likg moviesAgADpQQAAgIqkEU
      const movie = await Movie.findOne({ fileUniquId: fileId });
      if (!movie) {
        await ctx.reply("Np movie Found");
        await ctx.answerCallbackQuery();
        return;
      }
      console.log("sendlinmovie with data", movie);
      const caption = MovieCaption(movie);
      await ctx.replyWithVideo(movie.fileId, {
        reply_markup: videoButtons,
        caption,
      });
      await ctx.answerCallbackQuery();
    } catch (error) {
      await ctx.answerCallbackQuery();
      sendLog("failed To send Movie to do error in callbackquert");
      console.error("failed To send Movie to do error in callbackquert");
    }
  });

  bot.callbackQuery(
    /^next(.+)$/,
    async (ctx: Context & SessionFlavor<SessionData>) => {

      try {
        const searchedMovie = await ctx.session.movieName;
        if(!searchedMovie){
          console.log("searhed movie for call backquery is being failed");
          await ctx.answerCallbackQuery("searhed movie for call backquery is being failed");
          return
        }
      const pageNumber = parseInt(
        (await ctx.callbackQuery?.data?.replace("next_", "")) || "0"
      );
      if (!pageNumber) {
        console.log("PrevePageNumbetIS Not Avaialbe");
        ctx.answerCallbackQuery("invalid Page Nmber");
        return;
      }
        const MovieIDS = await serchtheMovie(searchedMovie);
        if(!MovieIDS){
          console.log("MovieIds in not avaliable in array format");
          ctx.answerCallbackQuery("movies ID in invalid");
          return
        }
        await sendMovies(ctx, MovieIDS, pageNumber);
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.log("error cause while playing eith callBack");
        sendLog("error cause while playing eith callBack");
        await ctx.answerCallbackQuery("Error loading movie").catch(() => {});
      }
    }
  );
  bot.callbackQuery(
    /^prev(.+)$/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      try {
      const pageNumber = parseInt(
        (await ctx.callbackQuery?.data?.replace("prev_", "")) || "0"
      );
      if (!pageNumber) {
        console.log("PrevePageNumbetIS Not Avaialbe");
        ctx.answerCallbackQuery("page number is invalid");
        return;
      }
        const searchedMovie = await ctx.session.movieName;
        if(!searchedMovie){
          console.log("searched mOvie is not avalable in session");
          ctx.answerCallbackQuery("searched mOvie is not avalable in session");
          return;
        }
        const MovieIDS = await serchtheMovie(searchedMovie!);
        if(!MovieIDS){
          console.log("MovieIds in not avaliable in array format");
          ctx.answerCallbackQuery("movies ID in invalid");
          return
        }
        await sendMovies(ctx, MovieIDS, pageNumber);
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.log("error cause while playing eith callBack");
        sendLog("error cause while playing eith callBack");
        await ctx.answerCallbackQuery();
      }
    }
  );
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
          caption: WelcomeCaption,
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
