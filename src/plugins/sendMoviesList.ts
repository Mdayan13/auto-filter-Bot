import { Context, InlineKeyboard, SessionFlavor } from "grammy";
import { prefixName, sendMovie } from "../utils/sendLogs";
import { SessionData } from "..";
export const sendMovies = async (
  isButton: boolean = false,
  ctx: Context & SessionFlavor<SessionData>,
  movieIds: any[],
  pages = 0,
  title?: string
) => {
  const RequestInline = new InlineKeyboard();
  RequestInline.url("🎥 Request in movie Channel", "https://t.me/+lODYBa0UJpExNTQ9").row();
  const LIST_size = 7;
  if (movieIds.length === 0) {
    await ctx.reply("No movies found matching your criteria.", {
      reply_markup: RequestInline
    });

    await ctx.answerCallbackQuery();
    return;
  }

  const start = LIST_size * pages;
  const end = start + LIST_size;
  await sendMovie(ctx, movieIds[start].fileUniquId.toString());
  if (start >= movieIds.length) {
    ctx.answerCallbackQuery("no movie Found");
    return;
  }
  const movieInline = new InlineKeyboard();
  for (let i = start; i < end; i++) {
    if (movieIds[i]) {
      movieInline
        .text(
          `${prefixName(movieIds[i].fileName, title)}`,
          `movies${movieIds[i].fileUniquId}`
        )
        .row();
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
  const messageText = `Page: ${pages}`;
  if (isButton) {
    const chatId = await ctx.session.chatId;
    const messageId = await ctx.session.messageId;
    if (!chatId || !messageId) {
      ctx.answerCallbackQuery("error in  page paginating");
      return;
    }
    try {
      await ctx.api.editMessageText(chatId, messageId, messageText, {
        reply_markup: movieInline,
      });
    } catch (error: any) {
      if (
        error.description &&
        error.description.includes("message is not modified")
      ) {
        console.log("Telegram: Message not modified, no action needed.");
      } else {
        console.error("Error editing message for pagination:", error);
        throw error;
      }
    }
  } else {
    const message = await ctx.reply(messageText, {
      reply_markup: movieInline,
    });
    ctx.session.chatId = message.chat.id;
    ctx.session.messageId = message.message_id;
  }
};
