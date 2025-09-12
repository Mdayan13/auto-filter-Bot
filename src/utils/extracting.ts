import { Context } from "grammy";
import { geminiQuery } from "../lib/gemini";
import { sendLog } from "./sendLogs";
import { config } from "../config";
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
type QualityMap = {
  instance: string[];
  value: string;
};

export const qualities: QualityMap[] = [
  {
    instance: ["240", "240p", "low", "lq", "loq", "poor", "p240"],
    value: "240p",
  },
  {
    instance: ["360", "360p", "med", "mq", "medium", "p360"],
    value: "360p",
  },
  {
    instance: ["480", "480p", "sd", "standard", "p480"],
    value: "480p",
  },
  {
    instance: ["720", "720p", "hd", "hdtv", "hq", "p720", "72op", "hdd"],
    value: "720p",
  },
  {
    instance: [
      "1080",
      "1080p",
      "fullhd",
      "fhd",
      "bluray",
      "brrip",
      "p1080",
      "108op",
      "fulhd",
    ],
    value: "1080p",
  },
  {
    instance: [
      "2160",
      "2160p",
      "4k",
      "uhd",
      "ultrahd",
      "p2160",
      "4 k",
      "4kk",
      "hdrip",
    ],
    value: "2160p",
  },
];

export const extractMovieQuality = (name: string) => {
  const toString = name.toLowerCase();
  for (const { instance, value } of qualities) {
    if (instance.some((word) => toString.includes(word))) {
      return value;
    }
  }
};
interface ReturnProps {
  isSeries: boolean;
  seriesNo?: number;
  episodeNo?: number;
}

export const seriesAndEpisodesIdentifier = (name: string): ReturnProps => {
  const lower = name.toLowerCase();

  // split filename into tokens on non-alphanumeric
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);

  let seriesNo: number | undefined;
  let episodeNo: number | undefined;

  const seasonKeys = [
    "s",
    "se",
    "seo",
    "se!",
    "season",
    "ssn",
    "sea", // extra abbreviations
  ];

  const episodeKeys = [
    "e",
    "ep",
    "eps",
    "epi",
    "episode",
    "epn",
    "epd", // sloppy/short variants
  ];

  for (const token of tokens) {
    // match formats like s2, se03, season4
    const match = token.match(/^([a-z!]+)(\d{1,3})$/);
    if (match) {
      const [_, prefix, numStr] = match;
      const num = parseInt(numStr, 10);

      if (seasonKeys.some((k) => prefix.startsWith(k))) {
        seriesNo = num;
      } else if (episodeKeys.some((k) => prefix.startsWith(k))) {
        episodeNo = num;
      }
    }

    // match "2x10" style
    const xMatch = token.match(/^(\d{1,2})x(\d{1,3})$/);
    if (xMatch) {
      seriesNo = parseInt(xMatch[1], 10);
      episodeNo = parseInt(xMatch[2], 10);
    }
  }

  return {
    isSeries: seriesNo !== undefined || episodeNo !== undefined,
    seriesNo,
    episodeNo,
  };
};
const startTime = Date.now();

export const getUptime = () => {
  let diff = Date.now() - startTime;
  let sec = Math.floor(diff / 1000) % 60;
  let min = Math.floor(diff / (1000 * 60)) % 60;
  let hr = Math.floor(diff / (1000 * 60 * 60)) % 24;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days}d ${hr}h ${min}m ${sec}s`;
};
