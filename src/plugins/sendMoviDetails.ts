import { Context, InlineKeyboard } from "grammy";
import { IMovie } from "../db/fileSchema";
import { MovieCaptionV2, videoButtons } from "../utils/constant";

export const sendMovieWithCaption2 = async (ctx: Context, movie: IMovie) => {
  const caption = MovieCaptionV2(movie);
  if (!ctx.message?.message_id || !ctx.chat?.id) {
    console.log("returning as you know");
    return;
  }
  await ctx.replyWithVideo(movie.fileId, {
    reply_markup: videoButtons,
    caption,
  });
};
export const sendMovieViaLangauges = async (
  ctx: Context,
  langList: string[]
) => {
  const languagesInline = new InlineKeyboard();

  try {
    for (let i = 0; i < langList.length; i += 2) {
      const first = langList[i];
      const second = langList[i + 1];

      languagesInline.text(`${first}`, `langList_${first}`);
      if (second) {
        languagesInline.text(`${second}`, `langList_${second}`).row();
      }
      languagesInline.row();
    }
    languagesInline.text("back to center", "backToMenu").row();
    await ctx.editMessageReplyMarkup({
      reply_markup: languagesInline,
    });
    await ctx.answerCallbackQuery(); // **FIXED**: Ensure callback is answered
  } catch (error) {
    console.error("Error in sendMovieViaLangauges:", error); // Improved error logging
    await ctx.answerCallbackQuery(
      "An error occurred while showing language options."
    );
  }
};

export const sendMoviesViaQuality = async (
  ctx: Context,
  qualityList: string[]
) => {
  const inlineQualityButtons = new InlineKeyboard(); // Always create a new instance

  try {
    for (let i = 0; i < qualityList.length; i++) {
      inlineQualityButtons // **FIXED**: Removed await here, as .text() is synchronous
        .text(`${qualityList[i]}`, `quality_${qualityList[i]}`)
        .row();
    }
    inlineQualityButtons.text("back To center", "backToMenu").row();

    await ctx.editMessageReplyMarkup({
      reply_markup: inlineQualityButtons,
    });
    await ctx.answerCallbackQuery(); // **FIXED**: Ensure callback is answered
  } catch (error) {
    console.error("Error in setting Up sendMoviesViaQuality:", error); // Improved error logging
    await ctx.answerCallbackQuery(
      "An error occurred while showing quality options."
    );
  }
};

export const sendVideoSerieses = async (
  ctx: Context,
  seriesNumbers: number[]
) => {
  const inlineSessionNumber = new InlineKeyboard(); // Always create a new instance

  try {
    for (let i = 0; i < seriesNumbers.length; i++) {
      inlineSessionNumber // **FIXED**: Removed await here, as .text() is synchronous
        .text(`Season ${seriesNumbers[i]}`, `Series_${seriesNumbers[i]}`)
        .row();
    }
    inlineSessionNumber.text("back to center", "backToMenu").row();
    await ctx.editMessageReplyMarkup({
      reply_markup: inlineSessionNumber,
    });
    await ctx.answerCallbackQuery(); // **FIXED**: Ensure callback is answered
  } catch (error) {
    console.error("Error in sendVideoSerieses:", error); // Improved error logging
    await ctx.answerCallbackQuery(
      "An error occurred while showing series options."
    );
  }
};
export const sendVideosOnYear = async (ctx: Context, listOfYear: number[]) => {
  const inlineButtonforYears = new InlineKeyboard(); // Always create a new instance

  try {
    for (let i = 0; i < listOfYear.length; i++) {
      inlineButtonforYears // **FIXED**: Removed await here, as .text() is synchronous
        .text(`YEAR ${listOfYear[i]}`, `TheYear_${listOfYear[i]}`)
        .row();
    }
    inlineButtonforYears.text("back to center", "backToMenu").row();
    await ctx.editMessageReplyMarkup({
      reply_markup: inlineButtonforYears,
    });
    await ctx.answerCallbackQuery(); // **FIXED**: Ensure callback is answered
  } catch (error) {
    console.error("Error in sendVideosOnYear:", error); // Improved error logging
    await ctx.answerCallbackQuery(
      "An error occurred while showing year options."
    );
  }
};
