import { Context, InlineKeyboard } from "grammy";
import { prefixName, sendMovie } from "../utils/sendLogs";

export const sendMovies = async (ctx: Context, movieIds: any[], pages = 0) => {
  const LIST_size = 7;
  if (movieIds.length === 0) return;

  const start = LIST_size * pages;
  const end = start + LIST_size;
  await sendMovie(ctx, movieIds[start].fileUniquId.toString());
  if (start >= movieIds.length) {
    return;
  }
  const movieInline = new InlineKeyboard();
  for (let i = start; i < end; i++) {
    if (movieIds[i]) {
      movieInline.text(
        `${prefixName(movieIds[i].fileName)}`,
        `movies${movieIds[i].fileUniquId}`
      ).row();
    }
  }
  if (pages > 0) {
    movieInline.text("⬅️ Prev", `prev_${pages - 1}`);
  }
  if (end < movieIds.length) {
    movieInline.text("Next ➡️", `next_${pages + 1}`);
  }
  if (pages > 0 || end < movieIds.length) {
    movieInline.row();
  }

  await ctx.reply("🎬 Select your movie:", {
    reply_markup: movieInline,
  });
};
