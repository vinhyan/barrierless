#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url); // to use 'require' syntax due to certain packages not supporting ES6 imports ('chalk' and package.json)
const { name, version, description } = require('../package.json');
const { Command } = require('commander');
import chalk from 'chalk';
import Groq from 'groq-sdk';
import { prompt } from './prompt.js';

import dotenv from 'dotenv';
dotenv.config();

// Command-line tool setup with commander
const program = new Command();
program
  .name(`${name}`)
  .description(`${description}`)
  .version(`${name}: ${version}`, '-v, --version', 'Barrierless Bot version');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main(text, targetLang) {
  const chatCompletion = await getGroqChatCompletion(text, targetLang);
  console.log(chatCompletion.choices[0]?.message?.content || '');
}
``;
export async function getGroqChatCompletion(text, targetLang) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt(text, targetLang),
      },
    ],
    model: 'llama3-8b-8192',
    temperature: 0.2, // value between 0 and 2. the lower is more deterministic, higher is more creative and random
  });
}

// Define the `query` command to execute a GROQ query
program
  .description('Translates a text using GROQCloud')
  .argument('<text>', 'Text to translate')
  .option('-l, --language <lang>', 'Target language for translation', 'en')
  .action(async (text, options) => {
    console.log(chalk.blue(`Translating ${text}...`));

    await main(text, options.language);
  });

// Parse the command-line arguments
program.parse(process.argv);
