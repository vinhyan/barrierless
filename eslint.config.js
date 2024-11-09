import globals from "globals";
import pluginJs from "@eslint/js";
import babelParser from "@babel/eslint-parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      parser: babelParser,
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
];
