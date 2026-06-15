import next from "next/eslint-plugin-next";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      next,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "error",
    },
  },
];
