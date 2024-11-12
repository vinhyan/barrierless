import { beforeAll, describe, jest } from "@jest/globals";

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
const { validateFiles, parseFiles } = await import("../../src/input/file");

describe("validateFiles() tests", () => {
  test("files is null, return false", () => {
    expect(validateFiles(null)).toBe(false);
  });

  test("files is an empty array, return true", () => {
    expect(validateFiles([])).toBe(false);
  });

  test("files contain one invalid file, return false", () => {
    expect(validateFiles(["dummy_file.txt", "dummy_file.md"])).toBe(false);
  });

  test("files contain all valid file, return true", () => {
    expect(
      validateFiles([
        "dummy_file_1.txt",
        "dummy_file_2.txt",
        "dummy_file_3.txt",
      ]),
    ).toBe(true);
  });
});

describe("parseFiles() tests", () => {
  const mdFilepath = "dummy_file.md";
  const mdFileData = "This is a markdown file.";

  const txtFilepath = "dummy_file.txt";
  const txtFileData = "This is a text file.";

  beforeAll(() => {
    fsPromises.__setMockFileData(mdFilepath, mdFileData);
    fsPromises.__setMockFileData(txtFilepath, txtFileData);
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("no files provided, throw error", async () => {
    await expect(parseFiles()).rejects.toThrow("No files provided.");
  });

  test("files is null, throw error", async () => {
    await expect(parseFiles()).rejects.toThrow("No files provided.");
  });

  test("one non-existent file provided, return empty array", async () => {
    await expect(parseFiles(["non_existing.txt"])).resolves.toEqual([]);
  });

  test("multiple files provided but one is non-existent, return an array that excludes the unknown file", async () => {
    const files = [txtFilepath, mdFilepath, "non_existing.txt"];
    const result = await parseFiles(files);
    expect(result.length).toBe(files.length - 1);
    expect(result.filter((f) => f.file === "non_existing.txt").length).toBe(0);
  });

  test("files provided, return an array of parsed files", async () => {
    const files = [txtFilepath, mdFilepath];
    const result = await parseFiles(files);
    expect(result[0]).toEqual({ file: txtFilepath, content: txtFileData });
    expect(result[1]).toEqual({ file: mdFilepath, content: mdFileData });
  });
});
