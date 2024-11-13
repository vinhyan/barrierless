import * as fsPromises from "node:fs/promises";
import chalk from "chalk";
import { parse } from "path";
import PQueue from "p-queue";

function validate(file) {
  if (file === "") return false;
  try {
    const { ext } = parse(file);
    if (!ext.length) throw new Error(`Error: ${file} is not a file.`);
    return ext === ".txt";
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    return false;
  }
}

// Validates all files, if ONE file is invalid, return false
export function validateFiles(files) {
  // mostly likely not happening as files input is required
  if (!(files && files.length > 0)) {
    console.log(chalk.red("Invalid input. No files provided."));
    return false;
  }

  let valid = true;
  files.forEach((f) => {
    if (!validate(f)) {
      valid = false;
      console.log(chalk.red(`Invalid file: ${f}.`));
    }
  });

  return valid;
}

export async function parseFiles(files) {
  if (!(files && files.length > 0)) {
    throw new Error("No files provided.");
  }

  let parsedFiles = [];

  const queue = new PQueue({ concurrency: 4 }); // process (read) up to 4 files concurrently

  files.forEach((file, index) => {
    const { base: fileBase } = parse(file);

    (async () => {
      const parsedFile = {};
      try {
        console.log(
          chalk.yellow(`   ${index + 1}/${files.length}: ${fileBase}`),
        );
        const fileContent = await queue.add(
          async () => await fsPromises.readFile(file, "utf-8"),
        );
        parsedFile["file"] = fileBase;
        parsedFile["content"] = fileContent;
        parsedFiles.push(parsedFile);
      } catch (error) {
        console.error(chalk.red(`*** Error: ${error.message} ***`));
      }
    })();
  });

  await queue.onIdle();
  return parsedFiles;
}
