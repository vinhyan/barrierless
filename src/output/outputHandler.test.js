/* global global */
import { beforeAll, describe, expect, jest } from "@jest/globals";
import path from "node:path";

let outputDir = "";

jest.unstable_mockModule("node:fs", () => ({
  existsSync: jest
    .fn()
    .mockImplementation((outputFolder) => outputDir === outputFolder),
  mkdirSync: jest.fn().mockImplementation((dir) => {
    outputDir = dir;
    return dir;
  }),
}));

const mockFiles = {};

jest.unstable_mockModule("node:fs/promises", () => ({
  __setMockFileData: jest
    .fn()
    .mockImplementation((filename, data) => (mockFiles[filename] = data)),
  writeFile: jest.fn().mockImplementation((filepath, content) => {
    const { dir } = path.parse(filepath);
    if (dir === outputDir) {
      fsPromises.__setMockFileData(filepath, content);
      return Promise.resolve(mockFiles);
    } else {
      return Promise.reject(new Error("unknown filepath"));
    }
  }),
}));

// const fs = await import("node:fs");
const fsPromises = await import("node:fs/promises");
const { outputHandler } = await import("../../src/output/outputHandler");

const originalConsoleErrorFn = global.console.error;

describe("outputHandler() tests", () => {
  const outputFolder = "translated_files";

  const file_1 = {
    file: "dummy_file.txt",
    content: "This is a text file.",
  };

  const file_2 = {
    file: "dummy_file_2.txt",
    content: "This is another text file.",
  };

  beforeAll(() => {
    outputDir = "";
  });

  test("no files provided, throw error", async () => {
    try {
      await outputHandler([]);
    } catch (error) {
      expect(error.message).toMatch("No files provided.");
    }
  });

  test("files is null, throw error", async () => {
    try {
      await outputHandler(null);
    } catch (error) {
      expect(error.message).toMatch("No files provided.");
    }
  });

  test("'translated_files' folder does not exist, create one and save translated file there", async () => {
    await outputHandler([file_1, file_2]);
    expect(outputDir).toBe(outputFolder);
  });

  test("translated files saved to 'translated_files' folder", async () => {
    await outputHandler([file_1, file_2]);
    expect(mockFiles).toEqual({
      "translated_files/dummy_file.txt": "This is a text file.",
      "translated_files/dummy_file_2.txt": "This is another text file.",
    });
  });

  let errOutput = null;

  function testErrorFn(...args) {
    errOutput = errOutput || [];
    args.forEach((arg) => errOutput.push(arg));
  }

  function finalize(output) {
    if (output && Array.isArray(output)) {
      return output.join("");
    }
    return output;
  }

  beforeEach(() => {
    global.console.error = testErrorFn;
    errOutput = null;
  });

  afterEach(() => {
    global.console.error = originalConsoleErrorFn;
    errOutput = null;
  });

  test("one of translated files has an unknown path, log error", async () => {
    await outputHandler([
      file_1,
      { file: "some_path/some_file.txt", content: "Some content" },
    ]);
    expect(finalize(errOutput)).toContain(`*** Error: unknown filepath ***`);
  });
});
