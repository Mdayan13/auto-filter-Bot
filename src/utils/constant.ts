import { Context, InlineKeyboard } from "grammy";
import { IMovie } from "../db/fileSchema";
import { config } from "../config";

export const botDetailsInfo = (
  ᴀʟʟᴜsᴇʀs: number,
  ᴘʀᴇᴍɪᴜᴍUSERS: number,
  ᴀʟʟꜰɪʟᴇs: number,
  getUptime: string
) =>
  `╭────[ 🗃 ᴅᴀᴛᴀʙᴀsᴇ 🗃 ]────⍟
│
├⋟ ᴀʟʟ ᴜsᴇʀs ⋟ ${ᴀʟʟᴜsᴇʀs}
├⋟ ᴘʀᴇᴍɪᴜᴍ ᴜꜱᴇʀꜱ ⋟ ${ᴘʀᴇᴍɪᴜᴍUSERS}
├⋟ ᴀʟʟ ꜰɪʟᴇs ⋟ ${ᴀʟʟꜰɪʟᴇs}
│
├────[ 💻 ᴠᴘs ᴅᴇᴛᴀɪʟs 💻 ]────⍟
│
├⋟ ᴜsᴇᴅ sᴛᴏʀᴀɢᴇ ⋟ 190.14 MB
├⋟ ꜰʀᴇᴇ sᴛᴏʀᴀɢᴇ ⋟ 321.86 MB
├⋟ ʀᴀᴍ ⋟ 60.1%
├⋟ ᴄᴘᴜ ⋟ 46.8%
│
├────[ 🤖 ʙᴏᴛ ᴅᴇᴛᴀɪʟs 🤖 ]────⍟
│
├⋟ ᴜᴘᴛɪᴍᴇ ⋟ ${getUptime}
├⋟ ᴅʙ ꜰɪʟᴇ'ꜱ ⋟ ${ᴀʟʟꜰɪʟᴇs}
│
╰─────────────────────⍟
`;

export const MovieCaption = (movie: IMovie) => {
  return `🍿  Movie Details
━━━━━━━━━━━━━━━

🎬 Title      : ${movie.fileName}
🎭 Genres     : ${
    Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "N/A"
  }
🌐 Languages  : ${movie.languages?.length ? movie.languages.join(", ") : "N/A"}
⚡uploaded By : https://t.me/Movie_Lord_Official
📅 Year       : ${movie.year ?? "Unknown"}
⏳ Duration   : ${formatDuration(movie.duration)}
📦 File Size  : ${convertToSize(movie.size)}`;
};
export const MovieCaptionV2 = (movie: IMovie) => {
  return `📁FILENAME: @filterbort03111bot ${movie.fileName}\n\n
  📦 File Size:  ${convertToSize(movie.size)}`;
};
const convertToSize = (size: number) => {
  if (!size) return "N/A";

  const kb = size / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${kb.toFixed(2)} KB`;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
};

export const WelcomeCaption = (ctx: Context) => {
  return `
🍿 Welcome, ${ctx.from?.first_name}!
━━━━━━━━━━━━━
🎬 Search movies instantly
▶️ Stream or download fast
🔍 Simple & clean interface
📂 GitHub: github.com/Mdayan13  
⚡ Turning coffee & ideas → into code & magic.
`;
};

export const OwnerCaption = `👨‍💻 Developer Intro  
━━━━━━━━━━━━━  
🌐 Web Developer  
🤖 Bot Builder  
🔗 Smart Contract Dev  

📂 GitHub: github.com/Mdayan13  
🐦 X: x.com/ayan_md97732  

⚡ Turning coffee & ideas → into code & magic.
`;
export const premiumCaption = `💎 Premium User Perks  
━━━━━━━━━━━━━  
✅ Ad-free experience  
⚡ Instant movie files  
🤖 AI language detection  
🌐 Chrome stream & download  
🚫 No daily verification  

📩 Plans & Pricing  
━━━━━━━━━━━━━  
💠 1 Month – ₹49  
💠 2 Months – ₹89  
💠 3 Months – ₹139  
💠 6 Months – ₹249  
💠 12 Months – ₹399  

👇 Pick a plan & unlock premium!
`;
export const autoForwardbotCaption = `📡 Auto Forward Bot  
━━━━━━━━━━━━━━━━━━  
Tired of copy-pasting?  
This bot does the job for you.  

⚡ Instantly forwards new posts  
🔄 From any channel to your chats  
👥 Send to groups, friends, or private logs  
🎯 Zero delays, fully automated  
🔔 Never miss an update again  

💼 Perfect for:  
✔️ Channel owners  
✔️ Content managers  
✔️ Teams & communities  

✨ Set it once → relax forever.  
Your content moves, even while you sleep.
`;

export const inlineButtonForWelcome = new InlineKeyboard();
export const visitInline = new InlineKeyboard();
export const videoButtons = new InlineKeyboard();
export const premiumInline = new InlineKeyboard();
export const autoForwardBot = new InlineKeyboard();
// Visit Inline
visitInline.text("Back", "BackToProfile").row();

// Inline Button for Welcome
inlineButtonForWelcome
  .text("Bot Owner", "botOwner")
  .text("Auto Forward Bot", "forwardBot")
  .row();

inlineButtonForWelcome
  .text("Premium", "premium")
  .url("Group", "https://t.me/+lODYBa0UJpExNTQ9")
  .row();

// Premium Inline
premiumInline.text("💎 Become Premium User").row();
premiumInline
  .text("Plan A", "firstPlan")
  .text("Plan B", "secondPlan")
  .text("Plan C", "thirdPlan")
  .row();
premiumInline.text("Back To Center", "BackToProfile").row();

// Auto Forward Bot Inline
autoForwardBot.text("Back To Center", "BackToProfile").row();
autoForwardBot.url("Coming Soon", "@perryperry_bot").row();

videoButtons
  .url("supportGroup", `${config.supportGroup}`)
  .url("Request Channel", `${config.requestChannel}`)
  .row();
videoButtons.url("Bot Develepor", `${config.botOwner}`).row();
videoButtons.text("Download / Stream", "dowloadAndStream").row();
videoButtons
  .text("🌍 languages", "Languages")
  .text("SE0 - EPI", "episods")
  .row();
videoButtons.text(" 🎥 Quality", "Quality").text("📅 year", "year").row();
// videoButtons.text("Back to list", "backTpList").row();
// Bio Image URI
export let BioImageUri =
  "AgACAgUAAxkBAAIBa2jAEzX4XpPKw85UGMmtI7tf-v7fAALhyDEbEvEBVu4_t0y4rG1-AQADAgADcwADNgQ";

// Movie Inline
export const botHelp = `
/details:-  for details of bot
/skipDuplcate:- for turning of the catch for duplicates in db`;
