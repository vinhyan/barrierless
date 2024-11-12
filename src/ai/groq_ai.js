import chalk from "chalk";
// import { capFirstLetter, getConfig } from "../utils.js";
import { Groq } from "groq-sdk";
import { prompt } from "../prompt.js";
import * as dotenv from "dotenv";
dotenv.config(); // loads the variables from the .env file in the Current Working Directory
import process from "node:process";
import { getConfig } from "../utils.js";

const config = getConfig();
const GROQ_API_KEY = config?.api_keys?.GROQ_API_KEY || process.env.GROQ_API_KEY;

export async function getGroqChatCompletion(
  fileContent,
  targetLang,
  providerModel,
) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error(
        "GROQ API key not found. Please set the GROQ_API_KEY environment variable in .env.",
      );
    }
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const res = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt(fileContent, targetLang),
        },
      ],
      model: providerModel || "llama3-8b-8192",
      temperature: 0.2, // value between 0 and 2. the lower is more deterministic, higher is more creative and random
    });
    return res.choices[0]?.message?.content || "";
  } catch (err) {
    console.error(chalk.red("Error connecting to GROQ:", err.message));
    // process.exit(1);
  }
}
