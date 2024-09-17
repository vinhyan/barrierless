// export const prompt = "Translate to English";

export const prompt = (text, targetLang) => {
  return `Translate ${text} to ${targetLang}. Do not provide any context or additional information.`;
};
