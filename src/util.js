import path from 'path';
import toml from 'toml';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Retrieve the values within the TOML config file (.barrierless), and export them as the `config` object
export function getConfig() {
  // Logic to read the values from the .barrierless config file in the home directory
  const os = require('os');
  const fs = require('fs');
  const __homedir = os.homedir();

  // Look for the relevant TOML file in home directory
  const tomlFilePath = path.join(__homedir, '.barrierless.toml');

  // If the file doesn't exist, no need to parse the file for defaults
  if (!fs.existsSync(tomlFilePath)) {
    return null;
  }

  let config = {};
  try {
    const configFileContent = fs.readFileSync(tomlFilePath, 'utf-8');
    config = toml.parse(configFileContent);
  } catch (error) {
    console.error(`Error reading TOML file: ${error.message}`);
    // If there was an error with parsing an existing file, exit.
    exit(1);
  }

  // Returns config values that were parsed from .barrierless.toml
  return config;
}

// Check file extension to ensure it is a .txt file
export function txtFilenameExt(filename) {
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

// Capitalize the first letter of a string
export function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
