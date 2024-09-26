#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url); // to use 'require' syntax due to certain packages not supporting ES6 imports ('chalk' and package.json)
const { name, version, description } = require('../package.json');
const { Command } = require('commander');
import chalk from 'chalk';
import Groq from 'groq-sdk';
import { prompt } from './prompt.js';
import fs from 'fs/promises';
const path = require('path');

import dotenv from 'dotenv';
dotenv.config();

// **** Helper functions ****
// Get GROQ chat completion
const apiKey = process.env.GROQ_API_KEY;

export async function getGroqChatCompletion(
  fileContent,
  targetLang,
  providerModel
) {
  try {
    if (!apiKey) {
      throw new Error(
        'GROQ API key not found. Please set the GROQ_API_KEY environment variable in .env.'
      );
    }
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    return groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt(fileContent, targetLang),
        },
      ],
      model: providerModel,
      temperature: 0.2, // value between 0 and 2. the lower is more deterministic, higher is more creative and random
    });
  } catch (err) {
    console.error(
      chalk.red('Error connecting to GROQ chat completion:', err.message)
    );
    process.exit(1);
  }
}

// Check file extension to ensure it is a .txt file
function txtFilenameExt(filename) {
  const ext = path.extname(filename);
  if (ext.toLocaleLowerCase() !== '.txt' || !ext) {
    return path.format({
      ...path.parse(filename),
      base: undefined, // Remove the current base (name + ext)
      ext: '.txt', // Add the .txt extension
    });
  }
  return filename;
}

// Command-line tool setup with commander
const program = new Command();
program
  .name(`${name}`)
  .description(`${description}`)
  .version(`${name}: ${version}`, '-v, --version', 'Barrierless Bot version');

// Define the `query` command to execute a GROQ query
program
  .description('Translates file(s) using GROQCloud')
  .argument('<files...>', 'File(s) to translate')
  .option('-l, --language <lang>', 'Target language for translation', 'english')
  .option('-o, --output <files...>', 'Output filename(s)')
  .option('-m, --model', 'AI provider model', 'llama3-8b-8192')
  .action(async (files, options) => {
    const targetLang = options.language;
    let isOutputProvided = options.output;

    try {
      const translatedContents = [];
      for (const file of files) {
        const fileContent = await fs.readFile(file, 'utf-8'); // read content from input file
        const chatCompletion = await getGroqChatCompletion(
          fileContent,
          targetLang,
          options.model
        );
        const translatedContent =
          chatCompletion.choices[0]?.message?.content || '';
        translatedContents.push(translatedContent);
        if (!isOutputProvided) {
          console.log(chalk.blue(`*** Translating "${file}"... ***`));
          console.log(translatedContent);
        }
      }
      // if outfile(s) provided, write translated content to file(s)
      if (isOutputProvided) {
        let outputFilename;
        for (let i = 0; i < options.output.length; i++) {
          // check if output filename contains .txt. If not, append .txt to the filename
          outputFilename = txtFilenameExt(options.output[i]);
          await fs.writeFile(outputFilename, translatedContents[i], 'utf-8');
          console.log(
            chalk.blue(
              `*** ${options.output[i]} is translated and saved to "${outputFilename}"... ***`
            )
          );
        }
      }
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
  });

// Parse the command-line arguments
program.parse(process.argv);
