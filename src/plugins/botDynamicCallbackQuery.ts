import { Api, Bot, Context, RawApi, SessionFlavor } from "grammy";
import { SessionData } from "..";
import { sendLog } from "../utils/sendLogs";
import { MovieCaptionV2, videoButtons } from "../utils/constant";
import { filterMovie } from "./filterMovie";
import { sendMovies } from "./sendMoviesList";

import { Movie } from "../db/fileSchema";

export const dynamicBotQuery = async (
  bot: Bot<Context & Api<RawApi> & SessionFlavor<SessionData>>
) => {
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
      const caption = MovieCaptionV2(movie);
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
        if (!searchedMovie) {
          console.log("searhed movie for call backquery is being failed");
          await ctx.answerCallbackQuery(
            "searhed movie for call backquery is being failed"
          );
          return;
        }
        const pageNumber = parseInt(
          (await ctx.callbackQuery?.data?.replace("next_", "")) || "0"
        );
        if (isNaN(pageNumber) || pageNumber < 0) {
          console.log("PrevePageNumbetIS Not Avaialbe");
          ctx.answerCallbackQuery("invalid Page Nmber");
          return;
        }
        const MovieIDS = await filterMovie(searchedMovie);
        if (!MovieIDS) {
          console.log("MovieIds in not avaliable in array format");
          ctx.answerCallbackQuery("movies ID in invalid");
          return;
        }
        await sendMovies(true, ctx, MovieIDS, pageNumber);
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
        if (isNaN(pageNumber) || pageNumber < 0) {
          console.log("PrevePageNumbetIS Not Avaialbe");
          ctx.answerCallbackQuery("page number is invalid");
          return;
        }
        const searchedMovie = await ctx.session.movieName;
        if (!searchedMovie) {
          console.log("searched mOvie is not avalable in session");
          ctx.answerCallbackQuery("searched mOvie is not avalable in session");
          return;
        }
        const MovieIDS = await filterMovie(searchedMovie!);
        if (!MovieIDS) {
          console.log("MovieIds in not avaliable in array format");
          ctx.answerCallbackQuery("movies ID in invalid");
          return;
        }
        await sendMovies(true, ctx, MovieIDS, pageNumber);
        await ctx.answerCallbackQuery();
      } catch (error) {
        await ctx.answerCallbackQuery();
      }
    }
  );

  bot.callbackQuery(
    /^langList_(.+)$/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      try {
        const choosedLang = await ctx.callbackQuery?.data?.replace(
          "langList_",
          ""
        );
        if (!choosedLang) {
          await ctx.answerCallbackQuery();
          return;
        }
        const movieName = ctx.session.movieName;
        if (!movieName) {
          await ctx.answerCallbackQuery();
          return;
        }
        const movieIdsList = await filterMovie(movieName, {
          language: choosedLang,
        });
        await sendMovies(true, ctx, movieIdsList,0,choosedLang);
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.error("faailed to send language required video");
        await ctx.answerCallbackQuery();
      }
    }
  );

  bot.callbackQuery(
    /^Series_(.+)/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      try {
        console.log("it is called after callbackQuary");

        const moviename = ctx.session.movieName;
        const seriresNumber = parseInt(
          ctx.callbackQuery?.data?.replace("Series_", "") || "0"
        );
        if (isNaN(seriresNumber) || seriresNumber < 0) {
          await ctx.answerCallbackQuery("failed with an series NUmber error");
          return;
        }
        if (!moviename) {
          await ctx.answerCallbackQuery("there is an error in serires buttons");
          return;
        }
        const moviesIds = await filterMovie(moviename, {
          seriesNumber: seriresNumber,
        });
        if (!moviesIds) {
          await ctx.answerCallbackQuery("error i ncalbackquery");
        }
        await sendMovies(false, ctx, moviesIds,0, seriresNumber.toString());
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.log("error in callbackquery while seriiding the number");
        await ctx.answerCallbackQuery();
      }
    }
  );

  bot.callbackQuery(
    /^quality_(.+)$/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      try {
        const quality = await ctx.callbackQuery?.data?.replace("quality_", "");
        const movieName = ctx.session.movieName;
        if (!movieName) {
          ctx.answerCallbackQuery("this quality has nothing to say");
          return;
        }
        if (!quality) {
          ctx.answerCallbackQuery("this quality has nothing to show");
          return;
        }
        const movieIds = await filterMovie(movieName, {
          quality,
        });
        await sendMovies(true, ctx, movieIds, 0, quality);
        await ctx.answerCallbackQuery();
      } catch (error) {
        console.log("error in quality Callback");
        await ctx.answerCallbackQuery();
      }
    }
  );

  bot.callbackQuery(
    /^TheYear_(.+)/,
    async (ctx: Context & SessionFlavor<SessionData>) => {
      console.log("it is called Afterr callbackQuary");

      try {
        console.log("quyery is being called si i know");
        const movieName = await ctx.session.movieName;
        if (!movieName) {
          ctx.answerCallbackQuery("omvie name is not in session");
          return;
        }
        const yearNumber = await parseInt(
          ctx.callbackQuery?.data?.replace("TheYear_", "") || "2000"
        );
        console.log("this is move year", yearNumber);
        if (isNaN(yearNumber)) {
          ctx.answerCallbackQuery("year number is not defined");
          return;
        }
        const moviesData = await filterMovie(movieName, { year: yearNumber });

        await sendMovies(true, ctx, moviesData, 0, yearNumber.toString());
        await ctx.answerCallbackQuery();
      } catch (error) {
        await ctx.answerCallbackQuery("year list is not defiiend");
      }
    }
  );
};
