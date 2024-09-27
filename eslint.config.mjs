// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	eslintConfigPrettier,
	{
		rules: {
			semi: "error",
			"require-await": "error",
			"@typescript-eslint/explicit-function-return-type":
				"error",
			"@typescript-eslint/no-confusing-void-expression":
				"off",
			"@typescript-eslint/no-invalid-void-type": "off",
			"@typescript-eslint/no-misused-promises": "off",
		},
	},
);
