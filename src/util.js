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
  const tomlFilePath = path.join(__homedir, '.barrierless');

  let config = {};
  try {
    const configFileContent = fs.readFileSync(tomlFilePath, 'utf-8');
    config = toml.parse(configFileContent);
  } catch (error) {
    console.error(`Error reading TOML file: ${error.message}`);
  }

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
