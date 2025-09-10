import { Context } from "grammy";
import { IMovie } from "../schemas/fileSchema";
import { MovieCaption, videoButtons } from "../utils/constant";
export const sendMovieWithCaption = async (ctx: Context, movie: IMovie) => {
  const caption = MovieCaption(movie);
  await ctx.editMessageReplyMarkup({
    reply_markup:videoButtons
    
  });
};
export const sendMovieWithCaption2 = async (ctx: Context, movie: IMovie) => {
  const caption = MovieCaption(movie);
  if (!ctx.message?.message_id || !ctx.chat?.id) {
    console.log("returning as you know");
    return;
  }
  await ctx.replyWithVideo(movie.fileId, {
    reply_markup: videoButtons,
    caption,
  });
};
