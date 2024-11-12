import { afterAll, describe, jest, test } from "@jest/globals";
import process from "node:process";
const originalEnv = process.env;
const MOCKED_GEMINI_API_KEY = "456";
const MODEL = "456";

// ==========================
const mockGenerateContent = jest.fn().mockImplementation((prompt) => {
  const res = {
    response: {
      text: () => `Mocked response: ${prompt}`,
    },
  };
  if (prompt) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(new Error("Prompt is required"));
  }
});
const mockGenerativeModel = jest.fn().mockImplementation(({ model }) => {
  if (model === MODEL) {
    return {
      generateContent: mockGenerateContent,
    };
  } else {
    throw new Error("Invalid AI model");
  }
});

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation((apiKey) => {
    if (apiKey === MOCKED_GEMINI_API_KEY) {
      return {
        getGenerativeModel: mockGenerativeModel,
      };
    } else {
      throw new Error(
        "401: Unauthorized. Please provide a valid Gemini API key.",
      );
    }
  }),
}));

jest.unstable_mockModule("../utils.js", () => ({
  getConfig: jest.fn().mockImplementation(() => false),
}));

jest.unstable_mockModule("../prompt.js", () => ({
  prompt: jest
    .fn()
    .mockImplementation((content, lang) => `${content} in ${lang}`),
}));

const { GoogleGenerativeAI } = await import("@google/generative-ai");
const { getConfig } = await import("../utils.js");

describe("Mock Gemini AI tests", () => {
  test("create a Gemini instance with a valid API key, return content", async () => {
    const genAI = new GoogleGenerativeAI(MOCKED_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL,
    });
    const res = await model.generateContent("Hello");
    expect(res.response.text()).toBe("Mocked response: Hello");
  });

  test("Gemini API key is invalid, throw error", async () => {
    try {
      const genAI = new GoogleGenerativeAI("dummy_key");
    } catch (error) {
      expect(error.message).toMatch(
        "401: Unauthorized. Please provide a valid Gemini API key.",
      );
    }
  });
});

describe("getGeminiChatCompletion() tests", () => {
  beforeEach(() => {
    jest.resetModules(); // clears the cache
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("Gemini API key not provided, throw error", async () => {
    const { getGeminiChatCompletion } = await import(
      "../../src/ai/gemini_ai.js"
    );
    try {
      await getGeminiChatCompletion("Hello", "english", MODEL);
    } catch (error) {
      expect(error.message).toMatch(
        "GEMINI API key not found. Please set the GEMINI_API_KEY environment variable in .env.",
      );
    }
  });

  test("invalid AI model, throw error", async () => {
    // set env variable before importing the module, so it can be used in the module
    process.env = { ...originalEnv, GEMINI_API_KEY: MOCKED_GEMINI_API_KEY };
    const { getGeminiChatCompletion } = await import(
      "../../src/ai/gemini_ai.js"
    );
    try {
      await getGeminiChatCompletion("Hello", "english", "dummy_model");
    } catch (error) {
      expect(error.message).toMatch("Invalid AI model");
    }
  });

  test("valid arguments, return translated content", async () => {
    process.env = { ...originalEnv, GEMINI_API_KEY: MOCKED_GEMINI_API_KEY };
    const { getGeminiChatCompletion } = await import(
      "../../src/ai/gemini_ai.js"
    );
    const content = await getGeminiChatCompletion("Hello", "english", MODEL);
    expect(content).toBe("Mocked response: Hello in english");
  });
});
