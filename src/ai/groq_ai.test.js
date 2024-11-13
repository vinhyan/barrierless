import { afterAll, describe, jest, test } from "@jest/globals";
import process from "node:process";
const originalEnv = process.env;
const MOCKED_GROQ_API_KEY = "123";
const MODEL = "123";

// ==========================
const mockCreate = jest.fn().mockImplementation((param) => {
  const res = {
    choices: [
      {
        message: {
          content: "Mocked response: Hello",
        },
      },
    ],
  };
  if (param.model === MODEL) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(new Error("Invalid AI model"));
  }
});

jest.unstable_mockModule("groq-sdk", () => ({
  Groq: jest.fn().mockImplementation((apiKeyObj) => {
    if (apiKeyObj.apiKey === MOCKED_GROQ_API_KEY) {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };
    } else {
      throw new Error(
        "401: Unauthorized. Please provide a valid GROQ API key.",
      );
    }
  }),
}));

jest.unstable_mockModule("../utils.js", () => ({
  getConfig: jest.fn().mockImplementation(() => false),
}));

const { Groq } = await import("groq-sdk");
// const { getConfig } = await import("../utils.js");

describe("Mock Groq AI tests", () => {
  test("create a Groq instance with a valid API key, return content", async () => {
    const groq = new Groq({
      apiKey: MOCKED_GROQ_API_KEY,
    });

    const res = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
      model: MODEL,
    });
    expect(res.choices[0].message.content).toBe("Mocked response: Hello");
  });

  test("GROQ API key is invalid, throw error", async () => {
    try {
      const groq = new Groq({ apiKey: "dummy_key" });
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: "Hello",
          },
        ],
        model: MODEL,
        temperature: 0.2,
      });
    } catch (error) {
      expect(error.message).toMatch(
        "401: Unauthorized. Please provide a valid GROQ API key.",
      );
    }
  });
});

describe("getGroqChatCompletion() tests", () => {
  beforeEach(() => {
    jest.resetModules(); // clears the cache
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("Groq API key not provided, throw error", async () => {
    const { getGroqChatCompletion } = await import("../../src/ai/groq_ai.js");
    try {
      await getGroqChatCompletion("Hello", "english", MODEL);
    } catch (error) {
      expect(error.message).toMatch(
        "GROQ API key not found. Please set the GROQ_API_KEY environment variable in .env.",
      );
    }
  });

  test("invalid AI model, throw error", async () => {
    // set env variable before importing the module, so it can be used in the module
    process.env = { ...originalEnv, GROQ_API_KEY: MOCKED_GROQ_API_KEY };
    const { getGroqChatCompletion } = await import("../../src/ai/groq_ai.js");

    try {
      await getGroqChatCompletion("Hello", "english", "dummy_model");
    } catch (error) {
      expect(error.message).toMatch("Invalid AI model");
    }
  });

  test("valid arguments, return translated content", async () => {
    process.env = { ...originalEnv, GROQ_API_KEY: MOCKED_GROQ_API_KEY };
    const { getGroqChatCompletion } = await import("../../src/ai/groq_ai.js");
    const content = await getGroqChatCompletion("Hello", "english", MODEL);
    expect(content).toBe("Mocked response: Hello");
  });
});
