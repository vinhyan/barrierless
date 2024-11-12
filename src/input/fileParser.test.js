import { beforeAll, describe, expect, jest } from "@jest/globals";

const mockFiles = {};

jest.unstable_mockModule("node:fs/promises", () => ({
  __setMockFileData: jest
    .fn()
    .mockImplementation((filename, data) => (mockFiles[filename] = data)),
  readFile: jest.fn().mockImplementation((filepath) => {
    const data = mockFiles[filepath];
    if (data) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(new Error("unknown filepath"));
    }
  }),
}));

const fsPromises = await import("node:fs/promises");
const { fileParser } = await import("../../src/input/fileParser");

describe("fileParser() tests", () => {
  const mdFilepath = "dummy_file.md";
  const mdFileData = "This is a markdown file.";

  const txtFilepath = "dummy_file.txt";
  const txtFileData = "This is a text file.";

  const txt2Filepath = "dummy_file_2.txt";
  const txt2FileData = "This is another text file.";

  beforeAll(() => {
    fsPromises.__setMockFileData(mdFilepath, mdFileData);
    fsPromises.__setMockFileData(txtFilepath, txtFileData);
    fsPromises.__setMockFileData(txt2Filepath, txt2FileData);
  });

  test("files is null, throw error", async () => {
    try {
      await fileParser(null);
    } catch (error) {
      expect(error.message).toMatch(
        "File must be of type txt, and filename cannot be empty.",
      );
    }
  });

  test("no files provided, throw error", async () => {
    try {
      await fileParser([]);
    } catch (error) {
      expect(error.message).toMatch(
        "File must be of type txt, and filename cannot be empty.",
      );
    }
  });

  test("one non-existent file provided, return empty array", async () => {
    const result = await fileParser(["non_existent_file.txt"]);
    expect(result).toEqual([]);
  });

  test("multiple files provided, but one is non-existent, return an array that excludes the unknown file", async () => {
    const files = [txtFilepath, txt2Filepath, "non_existing.txt"];
    const result = await fileParser(files);
    expect(result.length).toBe(files.length - 1);
    expect(result.filter((f) => f.file === "non_existing.txt").length).toBe(0);
  });

  test("multiple files provided, but one of them is not txt, throw error", async () => {
    const files = [txtFilepath, mdFilepath];
    try {
      await fileParser(files);
    } catch (error) {
      expect(error.message).toMatch(
        "File must be of type txt, and filename cannot be empty.",
      );
    }
  });

  test("txt files provided, return an array of parsed files", async () => {
    const files = [txtFilepath, txt2Filepath];
    const result = await fileParser(files);
    expect(result[0]).toEqual({ file: txtFilepath, content: txtFileData });
    expect(result[1]).toEqual({ file: txt2Filepath, content: txt2FileData });
  });
});
