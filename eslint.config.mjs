// @ts-check

import eslint from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default {
	parser: tsParser,
	plugins: [tsEslint, eslintConfigPrettier],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/strict",
		"plugin:@typescript-eslint/stylistic",
		"prettier",
	],
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: import.meta.dirname,
	},
	rules: {
		semi: "error",
		"require-await": "error",
		"@typescript-eslint/explicit-function-return-type":
			"error",
		"@typescript-eslint/no-misused-promises": "off",
		"@typescript-eslint/no-confusing-void-expression":
			"off",
		"@typescript-eslint/no-invalid-void-type": "off",
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
	},
};
