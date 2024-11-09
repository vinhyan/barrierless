import { beforeAll, jest } from "@jest/globals";

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
const { parseFiles } = await import("../../src/input/file");
const { validate } = await import("../../src/input/file");

describe("Validate() tests", () => {
  test("file name is blank, return false", () => {
    expect(validate("")).toBe(false);
  });

  test("file is a .txt, return true", () => {
    expect(validate("dummy_file.txt")).toBe(true);
  });

  test("file is not a .txt, return false", () => {
    expect(validate("dummy_file.md")).toBe(false);
  });

  test("file is null, return false", () => {
    expect(validate(null)).toBe(false);
  });
});

describe("ParseFiles() tests", () => {
  const mdFilepath = "dummy_file.md";
  const mdFileData = "This is a markdown file.";

  const txtFilepath = "dummy_file.txt";
  const txtFileData = "This is a text file.";

  beforeAll(() => {
    // Mock fsPromises.readFile to return the file data
    fsPromises.__setMockFileData(mdFilepath, mdFileData);
    fsPromises.__setMockFileData(txtFilepath, txtFileData);
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // fsPromises.__setMockFileData(mdFilepath, mdFileData);
    // fsPromises.__setMockFileData(txtFilepath, txtFileData);
  });

  test("fs is mocked", async () => {
    // fsPromises.__setMockFileData("dummy_file.txt", "This is a text file.");
    const result = await fsPromises.readFile(txtFilepath);
    expect(result).toBe("This is a text file.");
  });

  test("files is an array with one txt file, return array.length = 1", async () => {
    // fsPromises.__setMockFileData(mdFilepath, mdFileData);
    // fsPromises.__setMockFileData(txtFilepath, txtFileData);
    // await fsPromises.readFile("dummy_file.txt");
    const result = await parseFiles([txtFilepath]);
    expect(result[0]).toEqual({ file_name: txtFilepath, content: txtFileData });
  });

  // test("files is not an array, throw error", async () => {
  //   await expect(parseFiles(mdFilepath)).rejects.toThrow(
  //     "Invalid input. No files provided.",
  //   );
  // });

  // test("file is invalid (.md), return empty array", async () => {
  //   const result = await parseFiles([mdFilepath]);
  //   expect(result.length).toBe(0);
  // });

  // test("one out of n files is invalid, return array.length = n - 1", async () => {
  //   const files = ["cn.txt", "es.txt", "vi.txt", "dummy_file.md"];
  //   const result = await parseFiles(files);
  //   expect(result.length).toBe(files.length - 1);
  // });
});
