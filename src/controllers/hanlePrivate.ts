import { constNotfound, sendLog, sendmessage } from "../utils/sendLogs.js";
import { Context, SessionFlavor } from "grammy";
import { filterMovie } from "../plugins/filterMovie.js";
import { sendMovies } from "../plugins/sendMoviesList.js";
import {
  BioImageUri,
  inlineButtonForWelcome,
  visitInline,
} from "../utils/constant.js";

import { OwnerCaption, WelcomeCaption } from "../utils/constant.js";
import { SessionData } from "../index.js";
import { userInterface } from "../db/userSchema.js";
export const handlePrivate = async (
  ctx: Context & SessionFlavor<SessionData>
) => {
  try {
    if (!ctx.message?.text) {
      await ctx.answerCallbackQuery();
      return;
    }
    await ctx.reply(`🔍 On the hunt for your movie: ${ctx.message?.text}`, {
      reply_parameters: { message_id: ctx.message.message_id },
    });
    const searchQuery = await ctx.message.text;
    clearAllSession(ctx);
    ctx.session.movieName = searchQuery;
    const searchResult = await filterMovie(searchQuery);
    const promsie = await setResultIndatabase(ctx, searchResult);
    if (!promsie) {
      ctx.answerCallbackQuery("error in settting data to session");
      return;
    }
    console.log("the fucking srach result", searchResult);
    if (searchResult.length === 0) {
      return constNotfound(ctx.message.chat.id, ctx.message.text);
    }
    await sendMovies(false, ctx, searchResult);
  } catch (err: any) {
    console.error("🚨 Private message handler error:", err);
    await sendLog(`🚨 Private handler error: ${err.message}`);
  }
};

export const sendWelcome = async (ctx: Context) => {
  ctx.replyWithPhoto(BioImageUri, {
    caption: WelcomeCaption(ctx),
    reply_markup: inlineButtonForWelcome,
  });
};

export const sendOwnerDetails = async (ctx: Context) => {
  const ownerId = 7397841456;
  const bioPhotos = await ctx.api.getUserProfilePhotos(ownerId);
  const profileID = bioPhotos.photos[0][0].file_id;
  await ctx.editMessageMedia(
    {
      type: "photo",
      media: profileID,
      caption: OwnerCaption,
    },
    {
      reply_markup: visitInline,
    }
  );
};
interface returnData {
  fileUniquId: string;
  fileName: string;
  isSeries: boolean;
  quality: string;
  season: number;
  episode: number;
  year: number;
  languages: string[];
  score: number;
}
const setResultIndatabase = (
  ctx: Context & SessionFlavor<SessionData>,
  movieList: returnData[]
) => {
  console.log("what i got in in return ", movieList);
  let seriesNUmberList: number[] = [];
  let languagesList: string[] = [];
  let qualityList: string[] = [];
  let yearList: number[] = [];
  for (let i = 0; i < movieList.length; i++) {
    const { quality, season, languages, year } = movieList[i];
    if (movieList[i].isSeries) {
      seriesNUmberList.push(season);
    }
    languagesList.push(...languages);
    qualityList.push(quality);
    yearList.push(year);
  }
  seriesNUmberList = [...new Set(seriesNUmberList)];
  languagesList = [...new Set(languagesList)];
  qualityList = [...new Set(qualityList)];
  yearList = [...new Set(yearList)];
  if (qualityList) {
    ctx.session.availQuality = qualityList;
  }
  ctx.session.availableSeries = seriesNUmberList;
  ctx.session.avalLangs = languagesList;
  ctx.session.avalYear = yearList;
  return true;
};

const clearAllSession = (ctx: Context & SessionFlavor<SessionData>) => {
  ctx.session.availQuality = undefined;
  ctx.session.availableSeries = undefined;
  ctx.session.avalLangs = undefined;
  ctx.session.avalYear = undefined;
  ctx.session.movieName = undefined;
};
