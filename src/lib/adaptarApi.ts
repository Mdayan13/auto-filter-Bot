import axios, { AxiosError } from "axios";
import { Agent } from "https";

export const axiosAdapter = async (method: string, payload: any, token: string) => {
  console.log("Telegram with method:", method);

  const url = `https://api.telegram.org/bot${token}/${method}`;
  const httpsAgent = new Agent({ keepAlive: true, family: 4 });
  const config = {
    timeout: 110000,
    httpsAgent,
    headers: { "Content-Type": "application/json" },
  };

  try {
    // Use POST for all Telegram API methods
    const res = await axios.post(url, payload, config);
    // console.log(res.data)
    // console.log(res.status)
    // console.log(res.statusText)
    // Check if the Telegram API returned a success response
    if (!res.data.ok) {
      throw new Error(`Telegram API error: ${res.data.description || "Unknown error"}`);
    }
    console.log("success");
    return res.data;
  } catch (err: any) {
    const error = err as AxiosError;
    console.error(`⚠️ Telegram API call failed for method: ${method}`);
    console.error("Payload:", payload);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
      throw new Error(`Telegram API error: ${error.response.status} - ${error.response.data || JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received from Telegram API");
      throw new Error("No response received from Telegram API");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
      throw new Error("Telegram API request timed out");
    } else {
      console.error("Error message:", error.message);
      throw new Error(`Failed to call Telegram API: ${error.message}`);
    }
  }
};