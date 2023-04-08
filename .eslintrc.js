module.exports = {
  root: true,

  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },

  parserOptions: {
    parser: "@babel/eslint-parser",
  },

  rules: {
    "no-unused-vars": "warn",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": ["error", { ignores: ["fa"] }],
  },

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
};
