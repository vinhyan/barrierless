import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import chalk from 'chalk';
const { GoogleGenerativeAI } = require('@google/generative-ai');
import { prompt } from '../prompt.js';
import dotenv from 'dotenv';
dotenv.config(); // loads the variables from the .env file in the Current Working Directory

import { getConfig } from '../utils.js';
const config = getConfig();
const GEMINI_API_KEY =
  config?.api_keys?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function getGeminiChatCompletion(
  fileContent,
  targetLang,
  providerModel
) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error(
        'GEMINI API key not found. Please set the GEMINI_API_KEY environment variable in .env.'
      );
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: providerModel || 'gemini-1.5-flash',
    });

    const res = await model.generateContent(prompt(fileContent, targetLang));
    return await res.response.text();
  } catch (err) {
    console.error(chalk.red('Error connecting to GEMINI:', err.message));
    process.exit(1);
  }
}
