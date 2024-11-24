module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    // Добавьте свои правила ESLint, если необходимо
  },
};
