import * as fsPromises from "node:fs/promises";
import chalk from "chalk";
import path, { parse } from "path";

export function validate(file) {
  if (file === "") return false;
  try {
    const { ext } = parse(file);
    return ext === ".txt";
  } catch (err) {
    return false;
  }
}

export async function parseFiles(files) {
  if (!Array.isArray(files)) {
    throw new Error("Invalid input. No files provided.");
  }

  let parsedFiles = [];

  const parseFilePromises = files.map(async (file, index) => {
    const parsedFile = {};
    const fileName = path.basename(file);

    try {
      console.log(chalk.yellow(`   ${index + 1}/${files.length}: ${fileName}`));
      if (!validate(file)) {
        console.error(
          chalk.red(
            `Invalid file: ${file}. Filename cannot be empty, and must be a .txt file.`,
          ),
        );
        return;
      }
      const fileContent = await fsPromises.readFile(file, "utf-8");

      // Store file name and file content in a key-pair object
      parsedFile["file_name"] = fileName;
      parsedFile["content"] = fileContent;
      parsedFiles.push(parsedFile);
    } catch (error) {
      console.error(
        chalk.red(
          `*** Error: Unable to read "${fileName}"${files.length > 1 ? ". Skipping this file..." : ""} ***`,
        ),
      );
      console.error(error.message);
      return null;
    }
  });
  // Await all promises, then filter out any nulls (failed or invalid files)
  const resolvedFiles = await Promise.all(parseFilePromises);
  parsedFiles = resolvedFiles.filter((file) => file !== null);

  // try {

  // } catch (error) {
  //   console.error(chalk.red(`*** Error: ${error.message} ***`));
  // }
  return parsedFiles;
}

// const parseFilePromises = [];

// try {
//   let index = 0;
//   for await (const file of files) {
//     // if (!validate(file)) {
//     //   console.error(
//     //     chalk.red(
//     //       `Invalid file: ${file}. Filename cannot be empty, and must be a .txt file.`,
//     //     ),
//     //   );
//     //   break;
//     // }

//     const parsedFile = {};
//     const fileName = path.basename(file);

//     try {
//       console.log(
//         chalk.yellow(`   ${index + 1}/${files.length}: ${fileName}`),
//       );

//       if (!validate(file)) {
//         throw new Error(
//           `Invalid file: ${file}. Filename cannot be empty, and must be a .txt file.`,
//         );
//       }

//       const fileContent = await fs.readFile(file, "utf-8");
//       // Store file name and file content in a key-pair object
//       parsedFile["file_name"] = fileName;
//       parsedFile["content"] = fileContent;
//       parsedFiles.push(parsedFile);
//     } catch (error) {
//       console.error(
//         chalk.red(
//           `*** Error: Unable to read "${fileName}"${files.length > 1 ? ". Skipping this file..." : ""} ***`,
//         ),
//       );
//       console.error(error.message);
//     }
//   }
// } catch (error) {
//   console.error(chalk.red(`*** Error: ${error.message} ***`));
// }
