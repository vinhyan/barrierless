import fs from 'fs/promises';
import chalk from 'chalk';
import path from 'path';

export default async function fileParser(files) {
  console.log(chalk.blue(`📂 Reading file(s)... `));
  const parsedFiles = [];
  let i = 1;
  for (const file of files) {
    const parsedFile = {};
    const fileName = path.basename(file);
    try {
      console.log(chalk.yellow(`   ${i}/${files.length}: ${fileName}`));
      const fileContent = await fs.readFile(file, 'utf-8');
      // Store file name and file content in a key-pair object
      parsedFile['file_name'] = fileName;
      parsedFile['content'] = fileContent;
      parsedFiles.push(parsedFile);
      i++;
    } catch (error) {
      console.error(
        chalk.red(
          `*** Error: Unable to read "${fileName}". Skipping this file... ***`
        )
      );
    }
  }
  return parsedFiles;
}
