import path from 'path';

// Check file extension to ensure it is a .txt file
export function txtFilenameExt(filename) {
  const ext = path.extname(filename);
  if (ext.toLocaleLowerCase() !== '.txt' || !ext) {
    return path.format({
      ...path.parse(filename),
      base: undefined, // Remove the current base (name + ext)
      ext: '.txt', // Add the .txt extension
    });
  }
  return filename;
}

// Capitalize the first letter of a string
export function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
