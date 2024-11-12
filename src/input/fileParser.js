import chalk from "chalk";
import { parseFiles, validateFiles } from "./file.js";

export async function fileParser(files) {
  console.log(chalk.blue(`📂 Reading file(s)... `));

  if (!validateFiles(files)) {
    throw new Error("File must be of type txt, and filename cannot be empty.");
  }

  const parsedFiles = await parseFiles(files);
  return parsedFiles;
}
