import chalk from "chalk";
import { getIso639LanguageCode, capFirstLetter } from "../utils.js";
import path from "path";

export default async function translateFiles(
  parsedFiles,
  targetLang,
  aiProvider,
  aiModel,
) {
  const targetLangCode = getIso639LanguageCode(targetLang);
  console.log(
    chalk.blue(
      `🔄 Translating file(s) to ${chalk.yellow(
        capFirstLetter(targetLang),
      )}... `,
    ),
  );
  const translatedFiles = [];

  // [TODO] consider using something like https://www.npmjs.com/package/p-queue to run them in parallel,
  // but constrain how many actually run at once, for API limits.

  const translationPromises = parsedFiles.map(async (file) => {
    const { file_name, content } = file;
    try {
      const translatedContent = await aiProvider(content, targetLang, aiModel);

      // Edit filename to include targetLangCode
      const translatedFileName = getTranslatedFileName(
        file_name,
        targetLangCode,
      );

      translatedFiles.push({
        file_name: translatedFileName,
        content: translatedContent,
      });
    } catch (error) {
      console.error(chalk.red(`*** Error: ${error.message} ***`));
    }
  });
  
  // Promise.all will wait until all promises in the array are resolved, then will 
  // resolve itself it all promises are resolved successfully, or reject if any of 
  // the promises are rejected.
  try {
      await Promise.all(translationPromises);
  } catch(error) {
      console.error(chalk.red(`*** Error: ${error.message} ***`));
  }

  return translatedFiles;
}

function getTranslatedFileName(file_name, targetLangCode) {
  // Get the file extension and file name without the extension
  const fileExtension = path.extname(file_name);
  const fileNameWithoutExt = path.basename(file_name, fileExtension); // Get the file name without extension

  return `${fileNameWithoutExt}_${targetLangCode}${fileExtension}`;
}
