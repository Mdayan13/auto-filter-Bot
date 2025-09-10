import { GoogleGenAI } from "@google/genai";
import { sendLog } from "../utils/sendLogs";
import { config } from "../config";
type ResultOfQuery = {
  fileName: string;
  genres: string[];
};
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export const geminiQuery = async (movie: string): Promise<ResultOfQuery> => {
  if (!config.geminiApiKey) {
    await sendLog("🚨 GEMINI_API_KEY not found");
    throw new Error("AI service unavailable");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Clean the raw movie name "${movie}" by removing tags, extra words.
  Format as: Title + (Year) + [Language1+Language2...] + Quality+ S* E* as you widh i need just easy to understad + Extension. 
  If multiple languages, join them with + inside brackets. 
  Also extract genres as an array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            fileName: { type: "string" },
            genres: { type: "array", items: { type: "string" } },
          },
          required: ["fileName", "genres"],
        },
      },
    });
    if (!response.text) {
      throw new Error("failed to fetched response invalid response struvture");
    }
    // Now response.text is already valid JSON per schema
    const data = JSON.parse(response.text!) as ResultOfQuery;

    if (!data.fileName) {
      throw new Error(
        "failed to Parse data response don't have json xepected dataa"
      );
    }

    return data;
  } catch (err: any) {
    console.error("🚨 Gemini API error:", err);
    await sendLog(`🚨 Gemini API error: ${err.message}`);

    // Return fallback data instead of crashing
    return {
      fileName: movie,
      genres: ["unknown"],
    };
  }
};
