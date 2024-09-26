// export const prompt = "Translate to English";

export const prompt = (fileContent, targetLang) => {
  return `Translate ${fileContent} to ${targetLang}. Do not provide any context or additional information.`;
};
