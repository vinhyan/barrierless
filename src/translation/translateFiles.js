import chalk from "chalk";
import { getIso639LanguageCode, capFirstLetter } from "../utils.js";
import path from "path";
import PQueue from "p-queue";


export async function translateFiles(
  parsedFiles,
  targetLang,
  aiProvider,
  aiModel,
) {
  if (!(parsedFiles && parsedFiles.length > 0)) {
    throw new Error("No files provided.");
  }
  const targetLangCode = getIso639LanguageCode(targetLang);
  console.log(
    chalk.blue(
      `🔄 Translating file(s) to ${chalk.yellow(
        capFirstLetter(targetLang),
      )}... `,
    ),
  );
  const translatedFiles = [];

  const queue = new PQueue({ concurrency: 2 }); // process (translate) limit to 2 files concurrently to avoid API limits

  parsedFiles.forEach((file, index) => {
    const { file: fileBase, content } = file;

    (async () => {
      try {
        console.log(
          chalk.yellow(`   ${index + 1}/${parsedFiles.length}: ${fileBase}`),
        );
        const translatedContent = await queue.add(
          async () => await aiProvider(content, targetLang, aiModel),
        );

        // Edit file base to include targetLangCode
        const translatedFileName = getTranslatedFileBase(
          fileBase,
          targetLangCode,
        );

        translatedFiles.push({
          file: translatedFileName,
          content: translatedContent,
        });
      } catch (error) {
        console.error(chalk.red(`*** Error: ${error.message} ***`));
      }
    })();
  });
  await queue.onIdle();

  return translatedFiles;
}

function getTranslatedFileBase(fileBase, targetLangCode) {
  const { name, ext } = path.parse(fileBase);
  return `${name}_${targetLangCode}${ext}`;
}
