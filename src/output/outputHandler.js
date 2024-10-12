import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

export default async function outputHandler(translatedFiles) {
  console.log(chalk.blue('📝 Outputting translated file(s)...'));

  const outputFolder = 'translated_files';
  // Check if the folder exists, if not, create it
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // Write the translated files to the output folder
  for (let i = 0; i < translatedFiles.length; i++) {
    const { file_name, content } = translatedFiles[i];
    let filePath = path.join(outputFolder, file_name);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  console.log(
    chalk.blue(
      `📥 All translated files have been saved to the "/${outputFolder}" directory.`
    )
  );
}
