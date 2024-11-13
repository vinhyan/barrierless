import { describe, jest } from "@jest/globals";

const GROQ_AI_MODEL = "123";

jest.unstable_mockModule("../../src/ai/groq_ai.js", () => ({
  getGroqChatCompletion: jest
    .fn()
    .mockImplementation((content, targetLang, aiModel) => {
      if (aiModel !== GROQ_AI_MODEL) {
        return Promise.reject(new Error("Invalid AI model"));
      }
      return Promise.resolve("Translated content:\n" + content);
    }),
}));

jest.unstable_mockModule("../../src/utils.js", () => ({
  getIso639LanguageCode: jest.fn().mockImplementation((lang) => {
    if (!lang.length) return false;
    return "en";
  }),
}));

const { getGroqChatCompletion } = await import("../ai/groq_ai.js");
// const { getIso639LanguageCode } = await import("../utils.js");

import { translateFiles } from "./translateFiles.js";

describe("translateFiles() tests", () => {
  test("no files provided, throw error", async () => {
    try {
      await translateFiles([], "english", getGroqChatCompletion, "model");
    } catch (error) {
      expect(error.message).toBe("No files provided.");
    }
  });

  test("files is null, throw error", async () => {
    try {
      await translateFiles(null, "english", getGroqChatCompletion, "model");
    } catch (error) {
      expect(error.message).toBe("No files provided.");
    }
  });

  test("invalid AI model, throw error", async () => {
    try {
      await translateFiles(
        [{ file: "file.txt", content: "content" }],
        "english",
        getGroqChatCompletion,
        "invalid_model",
      );
    } catch (error) {
      expect(error.message).toBe("Invalid AI model");
    }
  });

  test("all valid arguments, return translated files", async () => {
    const parsedFiles = [
      { file: "file1.txt", content: "content1" },
      { file: "file2.txt", content: "content2" },
    ];

    const translatedFiles = await translateFiles(
      parsedFiles,
      "english",
      getGroqChatCompletion,
      GROQ_AI_MODEL,
    );

    expect(translatedFiles).toEqual([
      { file: "file1_en.txt", content: "Translated content:\ncontent1" },
      { file: "file2_en.txt", content: "Translated content:\ncontent2" },
    ]);
  });
});
