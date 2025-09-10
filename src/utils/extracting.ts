import { geminiQuery } from "../lib/gemini";
import { sendLog } from "./sendLogs";
type ResultOfQuery = {
  fileName: string;
  genres: string[];
};

const genres = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "sci-fi",
  "thriller",
  "documentary",
  "family",
  "musical",
  "western",
  "war",
  "history",
  "biography",
  "sport",
];
const langs = [
  "english",
  "hindi",
  "tamil",
  "telugu",
  "malayalam",
  "kannada",
  "marathi",
  "gujarati",
  "bengali",
  "punjabi",
  "spanish",
  "french",
  "german",
  "italian",
  "japanese",
  "korean",
  "chinese",
  "urdu",
];
const lang2 = [
  { key: "hin", value: "hindi" },
  { key: "Mal", value: "malayalam" },
  { key: "tam", value: "tamil" },
  { key: "eng", value: "english" },
];

export const getLanguages = async (name: string) => {
  const found: string[] = [];
  const lower = name.toLowerCase();
  for (const value of langs) {
    if (lower.includes(value)) {
      found.push(value);
    }
  }
  for (const { key, value } of lang2) {
    if (lower.includes(key)) {
      found.push(value);
    }
  }
  const unique = Array.from(new Set(found));
  return unique.length ? unique : ["unknown"];
};

export const getYear = async (name: string) => {
  const match = name.match(/\b(19[5-9]\d|20[0-4]\d|2050)\b/);
  return match ? parseInt(match[0]) : null;
};

export const AiFileTitleAndGenre = async (name: string) => {
  console.log("i will make the request");

  let newTitle = name.replace("@AP_FiLeS", "").replace("📁 𝐅𝐢𝐥𝐞 𝐍𝐚𝐦𝐞:", "");
  newTitle.replace("_", " ");
  const localGenres = extractGenre(name);
  if (process.env.ENV === "production") {
    try {
      const mainName: ResultOfQuery = await geminiQuery(newTitle);

      if (mainName) {
        const { fileName, genres } = mainName;
        return { newTitle2: fileName, genres };
      }
    } catch (err: any) {
      sendLog(`Ai gemini Failed due to: ${err.message}`);
    }
  }

  // fallback (non-production or AI error)
  return { newTitle2: newTitle, genres: localGenres };
};

export const extractGenre = (name: string) => {
  const lowerName = name.toLowerCase();
  const found: string[] = [];

  for (const genre of genres) {
    if (lowerName.includes(genre)) {
      found.push(genre);
    }
  }
  return found.length ? found : ["unknown"];
};
export const getThubnailUrl = async (name: string) => {
  return null;
};
