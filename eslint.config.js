import eslintPluginSvelte from "eslint-plugin-svelte"
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"
import typescriptEslintParser from "@typescript-eslint/parser"
import svelteParser from "svelte-eslint-parser"

export default [
  {
    ignores: ["node_modules/**", "build/**", ".svelte-kit/**", "dist/**"]
  },
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      parser: typescriptEslintParser,
      sourceType: "module",
      ecmaVersion: "latest"
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules
    }
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptEslintParser,
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      svelte: eslintPluginSvelte
    },
    rules: {
      ...eslintPluginSvelte.configs.recommended.rules
    }
  }
]
