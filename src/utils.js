import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "path";
import * as toml from "toml";
// Removed unused require statement
const ISO6391 = require("iso-639-1"); // for language code conversion/validation - using require to satisfy Jest mocks
import * as lang6393 from "iso-639-3";
import chalk from "chalk";
import * as os from "os";
import * as fs from "node:fs";
import process from "node:process";

// Display banner
export function displayBanner() {
  console.log(
    chalk.blue(`
 ____                  _           _               
| __ )  __ _ _ __ _ __(_) ___ _ __| | ___  ___ ___ 
|  _ \\ / _\` | '__| '__| |/ _ \\ '__| |/ _ \\/ __/ __|
| |_) | (_| | |  | |  | |  __/ |  | |  __/\\__ \\__ \\
|____/ \\__,_|_|  |_|  |_|\\___|_|  |_|\\___||___/___/
`),
  );
}

// Retrieve the values within the TOML config file (.barrierless), and export them as the `config` object
export function getConfig() {
  // Logic to read the values from the .barrierless config file in the home directory
  const __homedir = os.homedir();

  // Look for the relevant TOML file in home directory
  const tomlFilePath = path.join(__homedir, ".barrierless.toml");
  console.log("tomlFilePath", tomlFilePath);
  // If the file doesn't exist, no need to parse the file for defaults
  if (!fs.existsSync(tomlFilePath)) {
    console.log("uh oh its null");
    return null;
  }

  let config = {};
  try {
    const configFileContent = fs.readFileSync(tomlFilePath, "utf-8");
    config = toml.parse(configFileContent);
  } catch (error) {
    console.error(`Error reading TOML file: ${error.message}`);
    return null;
  }

  // Returns config values that were parsed from .barrierless.toml
  return config;
}

// Capitalize the first letter of a string
export function capFirstLetter(string) {
  if (!(typeof string === "string" && string.length)) return false;
  return string
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join the words back into a single string
}

// Validate target language
export function getIso639LanguageCode(language) {
  if (!(typeof language === "string" && language.length)) {
    throw new Error("Invalid language. Language must be a non-empty string.");
  }
  // Attempt to get the ISO 639-1 language code
  let targetLangCode = ISO6391.getCode(language);
  let isLangFound = targetLangCode !== "";

  // If the language code is not found from IOS 639-1, attempt to get the ISO 639-3 language code
  if (!isLangFound) {
    const language6393 = lang6393.iso6393.find(
      (lang) => lang.name.toLowerCase() === language.toLowerCase(),
    );

    if (language6393 && language6393.iso6393) {
      targetLangCode = language6393.iso6393;
      isLangFound = true;
    }
  }

  // If the language is not found from both 639-1 and 639-3, throw an error
  if (!isLangFound) {
    throw new Error(`Unable to find language code for "${language}".`);
  }

  return targetLangCode;
}

// Display translated contents to console
export function displayTranslatedContents(translatedFiles) {
  if (!(translatedFiles && translatedFiles.length > 0)) {
    console.log(chalk.red("No translated files to display."));
    return false;
  }
  console.log(chalk.blue("✅ Results:"));

  for (let i = 0; i < translatedFiles.length; i++) {
    const { file, content } = translatedFiles[i];
    console.log(chalk.yellow(`*** ${file} ***`));
    console.log(content);
  }
}
