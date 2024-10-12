#!/usr/bin/env node
import chalk from 'chalk';
import { getGroqChatCompletion } from './ai/groq_ai.js';
import { getGeminiChatCompletion } from './ai/gemini_ai.js';
import {
  capFirstLetter,
  getConfig,
  displayTranslatedContents,
} from './utils.js';
import fileParser from './input/fileParser.js';
import translateFiles from './translation/translateFiles.js';
import outputHandler from './output/outputHandler.js';
import argParser from './cli/argParser.js';

async function main() {
  // AI Providers
  const AI_PROVIDERS = {
    groq: getGroqChatCompletion,
    gemini: getGeminiChatCompletion,
  };
  
  const { options, args } = argParser(); // args = files to translate
  const config = getConfig();

  // Prefer the command-line input for language, but use the config file's value if there's no command-line input
  const targetLang =
    options.language ||
    config?.preferences?.LANGUAGE ||
    process.env.LANGUAGE ||
    'english';

  // Chosen AI provider
  const provider = options.provider || 'groq';

  try {
    if (!AI_PROVIDERS[provider]) {
      throw new Error('Invalid AI provider. Please enter "Groq" or "Gemini".');
    }
    // Display provider
    console.log('\n');
    console.log(chalk.green('Provider:'), capFirstLetter(provider));

    // Parse files
    const parsedFiles = await fileParser(args);

    // Translate files
    const translatedFiles = await translateFiles(
      parsedFiles,
      targetLang,
      getGeminiChatCompletion,
      options.model
    );

    // Output or display translated contents
    options.output
      ? outputHandler(translatedFiles)
      : displayTranslatedContents(translatedFiles);

    console.log(chalk.green('*** Done! ***'));
    process.exit(0);
  } catch (err) {
    console.error(
      chalk.red(
        'Error translating text: ',
        err.error?.error?.message || err.message
      )
    );
    process.exit(1);
  }
}

main();
