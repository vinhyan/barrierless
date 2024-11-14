import { describe, expect, test, jest, beforeEach, afterEach } from "@jest/globals";
import process from "node:process";

const argParser = (await import("./argParser")).default;

describe("argParser tests", () => {
  let exitMock;

  beforeEach(() => {
    exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    exitMock.mockRestore(); 
  });

  test("parses query command with file argument", () => {
    process.argv = ["node", "hi.js", "file1.txt"];
    const { args } = argParser();
    expect(args).toEqual(["file1.txt"]);
  });

  test("parse language and output options", () => {
    process.argv = ["node", "script.js", "file.txt", "-l", "fr", "-o"];
    const { options } = argParser();
    expect(options).toEqual({
      language: "fr",
      output: true,
    });
  });

  test("parse provider and model options", () => {
    process.argv = [
      "node",
      "hi.js",
      "file.txt",
      "-p",
      "Gemini",
      "-m",
      "gemini-1.5-flash",
    ];
    const { options } = argParser();
    expect(options).toEqual({
      provider: "Gemini",
      model: "gemini-1.5-flash",
    });
  });
});
