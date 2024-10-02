#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version, description } = require('../package.json');
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import { getGroqChatCompletion } from './ai_providers/groq_ai.js';
import { getGeminiChatCompletion } from './ai_providers/gemini_ai.js';
import { txtFilenameExt, capFirstLetter, getConfig } from './util.js';

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
  .option(
    '-p, --provider <provider>',
    'AI provider: enter "Groq" or "Gemini". Default is Groq'
  )
  .option('-m, --model <model>', 'AI provider model')
  .action(async (files, options) => {
    const config = getConfig();

    // Prefer the command-line input for language, but use the config file's value if there's no command-line input
    const targetLang = options.language || config.preferences.language || process.env.language;
    let isOutputProvided = options.output;
    let translatedContent;

    try {
      const translatedContents = [];

      if (options.provider) {
        if (!(options.provider === 'groq' || options.provider === 'gemini')) {
          throw new Error(
            'Invalid AI provider. Please enter "Groq" or "Gemini".'
          );
        }
      }
      // Display provider
      console.log(
        chalk.green(
          'Provider:',
          options.provider ? capFirstLetter(options.provider) : 'Groq'
        )
      );

      for (const file of files) {
        const fileContent = await fs.readFile(file, 'utf-8');

        // Default provider is Groq
        if (!options.provider || options.provider === 'groq') {
          const groqCompletion = await getGroqChatCompletion(
            fileContent,
            targetLang,
            options.model
          );
          translatedContent = groqCompletion.choices[0]?.message?.content || '';
        } else {
          const geminiCompletion = await getGeminiChatCompletion(
            fileContent,
            targetLang,
            options.model
          );
          translatedContent = geminiCompletion.response.text();
        }
        // Store all translated contents in an array
        translatedContents.push(translatedContent);

        // Print translated content to console if no output file(s) option provided
        if (!isOutputProvided) {
          console.log(chalk.blue(`*** Translating "${file}"... ***`));
          console.log(translatedContent);
        }
      }
      // If output file(s) provided, write translated content to file(s)
      if (isOutputProvided) {
        let outputFilename;
        for (let i = 0; i < options.output.length; i++) {
          // Check if output filename contains .txt. If not, append .txt to the filename
          outputFilename = txtFilenameExt(options.output[i]);
          await fs.writeFile(outputFilename, translatedContents[i], 'utf-8');
          console.log(
            chalk.blue(
              `*** ${options.output[i]} is translated and saved to "${outputFilename}" ***`
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
