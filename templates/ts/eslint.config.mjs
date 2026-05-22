import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "complexity": ["error", 10],
      "max-lines": ["error", { "max": 300, "skipBlankLines": true, "skipComments": true }],
      "max-lines-per-function": ["error", { "max": 50, "skipBlankLines": true, "skipComments": true }],
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["**/internal/**", "**/_*/**"],
              "message": "Import through the module's public boundary instead of private internals."
            }
          ]
        }
      ]
    }
  },
  {
    ignores: ["dist/**", "build/**", "coverage/**", "node_modules/**"]
  }
);
