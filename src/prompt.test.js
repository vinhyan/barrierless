import { describe, test, expect } from "@jest/globals";
import { prompt } from "./prompt.js";

describe("prompt() tests", () => {
  test("if only one argument is provided, throw an error ", () => {
    expect(() => prompt("Hello")).toThrow(
      "Prompt and target language are required",
    );
  });

  test("if arguments are empty strings, throw an error ", () => {
    expect(() => prompt("", "")).toThrow(
      "Prompt and target language are required",
    );
  });

  test("if no arguments are provided, throw an error ", () => {
    expect(() => prompt()).toThrow("Prompt and target language are required");
  });

  test("prompt() should return a prompt message", () => {
    const fileContent = "Hello, World!";
    const targetLang = "es";
    const expected = `Translate the following text to ${targetLang}:\n
          "${fileContent}\n\n"   
          Do not provide any context or additional information.`;
    expect(prompt(fileContent, targetLang)).toBe(expected);
  });
});
