const promptContent = (fileContent, targetLang) => {
  return `Translate the following text to ${targetLang}:\n
          "${fileContent}\n\n"   
          Do not provide any context or additional information.`;
};

// preferably to specify a source language, (and/or language codes according to ISO 639-1)
export const prompt = (fileContent, targetLang) => {
  return promptContent(fileContent, targetLang);
};
