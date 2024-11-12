import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import chalk from "chalk";
import path from "path";
import PQueue from "p-queue";

export async function outputHandler(translatedFiles) {
  if (!(translatedFiles && translatedFiles.length > 0)) {
    throw new Error("No files provided.");
  }

  console.log(chalk.blue("📝 Outputting translated file(s)..."));

  const outputFolder = "translated_files";
  // Check if the folder exists, if not, create it
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const queue = new PQueue({ concurrency: 4 }); // process (write) up to 4 files concurrently

  translatedFiles.forEach((file, index) => {
    const { file: fileBase, content } = file;

    (async () => {
      try {
        console.log(
          chalk.yellow(
            `   ${index + 1}/${translatedFiles.length}: ${fileBase}`,
          ),
        );
        const filepath = path.join(outputFolder, fileBase);
        await queue.add(
          async () => await fsPromises.writeFile(filepath, content, "utf-8"),
        );
      } catch (error) {
        console.error(chalk.red(`*** Error: ${error.message} ***`));
      }
    })();
  });

  await queue.onIdle();

  console.log(
    chalk.blue(
      `📥 All translated files have been saved to the "/${outputFolder}" directory.`,
    ),
  );
}
