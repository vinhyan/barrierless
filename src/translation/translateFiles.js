import chalk from 'chalk';
import ISO6391 from 'iso-639-1'; // for language code conversion/validation
import { getIso639LanguageCode, capFirstLetter } from '../utils.js';

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
      const translatedFileName = `${file_name.replace(
        '.txt',
        `_${targetLangCode}.txt`
      )}`;

      translatedFiles.push({
        file_name: translatedFileName,
        content: translatedContent,
      });
    } catch (error) {
      console.error(chalk.red(`*** Error: ${error.message} ***`));
    }
  }

  // for (const [fileName, fileContent] of Object.entries(parsedFiles)) {
  //   try {
  //     const translatedContent = await aiProvider(
  //       fileContent,
  //       targetLang,
  //       aiModel
  //     );

  //     // Edit filename to include targetLangCode
  //     const translatedFileName = `${fileName.replace(
  //       '.txt',
  //       `_${targetLangCode}.txt`
  //     )}`;

  //     translatedFiles[translatedFileName] = translatedContent;
  //   } catch (error) {
  //     console.error(chalk.red(`*** Error: ${error.message} ***`));
  //   }
  // }
  return translatedFiles;
}

// const parsedFiles = [
//   {
//     title: 'cn-file_vi.txt',
//     content: 'Trong thế giới nhịp sống nhanh như hiện nay...',
//   },
//   {
//     title: 'en-file_vi.txt',
//     content: 'Mỗi ngày là một cơ hội mới để học hỏi...',
//   },
// ];
