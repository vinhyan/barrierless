/* global global */
import { describe, expect, jest, test } from "@jest/globals";

let homeDir = "/home/user";

jest.unstable_mockModule("os", () => ({
  homedir: jest.fn().mockReturnValue(homeDir),
}));

let tomlFiles = {};

jest.unstable_mockModule("node:fs", () => ({
  existsSync: jest.fn().mockImplementation((filepath) => {
    return Object.hasOwn(tomlFiles, filepath);
  }),
  __setMockFileData: jest
    .fn()
    .mockImplementation((filename, data) => (tomlFiles[filename] = data)),
  readFileSync: jest.fn().mockImplementation((filepath) => {
    const data = tomlFiles[filepath];
    if (data) {
      return data;
    } else {
      throw new Error("unknown filepath");
    }
  }),
}));

jest.unstable_mockModule("toml", () => ({
  parse: jest.fn().mockImplementation((content) => {
    if (content) {
      return { content };
    } else {
      throw new Error("Error parsing TOML file");
    }
  }),
}));

const mockGetCode = jest.fn().mockImplementation((language) => {
  if (language === "apple" || language === "Zulu") return "";
  return `1-${language[0]}${language[1]}`;
});

jest.mock("iso-639-1", () => ({
  getCode: mockGetCode,
}));

// mocking the iso6393 array from "iso-639-3"
jest.unstable_mockModule("iso-639-3", () => {
  return {
    __esModule: true,
    iso6393: [
      {
        name: "Zulu",
        type: "living",
        scope: "individual",
        iso6393: "aaa",
      },
    ],
  };
});

const fs = await import("node:fs");
const toml = await import("toml");
const {
  getConfig,
  capFirstLetter,
  getIso639LanguageCode,
  displayTranslatedContents,
  displayBanner,
} = await import("./utils.js");

describe("getConfig() tests", () => {
  const tomlFilePath = "/home/user/.barrierless.toml";
  const tomlFileData = `
    [preferences]
    LANGUAGE = "english"
  `;

  test("config file does not exist, return null", async () => {
    expect(getConfig()).toBeNull();
  });

  test("config file exists, return config object", async () => {
    fs.__setMockFileData(tomlFilePath, tomlFileData);
    const config = getConfig();
    expect(config).toEqual(toml.parse(tomlFileData));
  });

  test("error reading config file, return null", async () => {
    fs.__setMockFileData(tomlFilePath, null);
    expect(getConfig()).toBeNull();
  });
});

describe("capFirstLetter() tests", () => {
  test("argument is not a string, return false", async () => {
    const string = null;
    expect(capFirstLetter(string)).toBe(false);
  });

  test("string is empty, return false", async () => {
    const string = "";
    expect(capFirstLetter(string)).toBe(false);
  });

  test("string is not empty, return capitalized string", async () => {
    const string = "hello world";
    expect(capFirstLetter(string)).toBe("Hello World");
  });
});

describe("getIso639LanguageCode() tests", () => {
  test("language is not a string, throw error", async () => {
    const language = null;
    expect(() => getIso639LanguageCode(language)).toThrow(
      "Invalid language. Language must be a non-empty string.",
    );
  });

  test("language is empty, throw error", async () => {
    const language = "";
    expect(() => getIso639LanguageCode(language)).toThrow(
      "Invalid language. Language must be a non-empty string.",
    );
  });

  test("language is not empty, return ISO 639-1 language code", async () => {
    const language = "english";
    expect(getIso639LanguageCode(language)).toBe("1-en");
  });

  test("language is not found from ISO 639-1, return ISO 639-3 language code", async () => {
    const language = "Zulu";
    expect(getIso639LanguageCode(language)).toBe("aaa");
  });

  test("language is not found from ISO 639-1 and ISO 639-3, throw error", async () => {
    const language = "apple";
    expect(() => getIso639LanguageCode(language)).toThrow(
      `Unable to find language code for "${language}".`,
    );
  });
});

const originalConsoleLogFn = global.console.log;

let logOutput = null;

function testLogFn(...args) {
  logOutput = logOutput || [];
  args.forEach((arg) => logOutput.push(arg));
}

function finalize(output) {
  if (output && Array.isArray(output)) {
    return output.join("");
  }
  return output;
}

describe("displayTranslatedContents() tests", () => {
  beforeEach(() => {
    global.console.log = testLogFn;
    logOutput = null;
  });

  afterEach(() => {
    global.console.log = originalConsoleLogFn;
    logOutput = null;
  });

  const translatedFiles = [{ file: "file1.txt", content: "content1" }];

  test("no translated files provided, display error message", async () => {
    expect(displayTranslatedContents()).toBe(false);
  });

  test("translated files provided, display translated contents", async () => {
    displayTranslatedContents(translatedFiles);
    const expectedOutput = `${translatedFiles[0].file}`;
    expect(finalize(logOutput)).toContain(expectedOutput);
  });
});

describe("displayBanner() tests", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(global.console, "log");
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("display banner", () => {
    displayBanner();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
