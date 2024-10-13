import chalk from 'chalk';
import { getIso639LanguageCode, capFirstLetter } from '../utils.js';
import path from 'path';

export default async function translateFiles(
  parsedFiles,
  targetLang,
  aiProvider,
  aiModel
) {
  const targetLangCode = getIso639LanguageCode(targetLang);
  console.log(
    chalk.blue(
      `🔄 Translating file(s) to ${chalk.yellow(
        capFirstLetter(targetLang)
      )}... `
    )
  );
  const translatedFiles = [];

  for (let i = 0; i < parsedFiles.length; i++) {
    const { file_name, content } = parsedFiles[i];
    try {
      const translatedContent = await aiProvider(content, targetLang, aiModel);

      // Edit filename to include targetLangCode
      const translatedFileName = getTranslatedFileName(
        file_name,
        targetLangCode
      );

      translatedFiles.push({
        file_name: translatedFileName,
        content: translatedContent,
      });
    } catch (error) {
      console.error(chalk.red(`*** Error: ${error.message} ***`));
    }
  }
  return translatedFiles;
}

function getTranslatedFileName(file_name, targetLangCode) {
  // Get the file extension and file name without the extension
  const fileExtension = path.extname(file_name);
  const fileNameWithoutExt = path.basename(file_name, fileExtension); // Get the file name without extension

  return `${fileNameWithoutExt}_${targetLangCode}${fileExtension}`;
}
