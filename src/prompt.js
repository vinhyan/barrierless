export const prompt = (fileContent, targetLang) => {
  return `Translate this content: ${fileContent} to the ${targetLang} language. Do not provide any context or additional information.`;
};
