import chalk from "chalk";
import { parseFiles } from "./file.js";

export default async function fileParser(files) {
  console.log(chalk.blue(`📂 Reading file(s)... `));
  try {
    const parsedFiles = await parseFiles(files);
    return parsedFiles;
  } catch (error) {
    console.error(chalk.red(`*** Error: ${error.message} ***`));
  }
}
