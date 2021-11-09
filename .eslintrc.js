module.exports = {
  env: {
    browser: true,
    "react-native/react-native": true,
    es2021: true,
  },
  parser: "@babel/eslint-parser",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 8,
    sourceType: "module",
  },
  plugins: ["react", "react-native"],
  rules: {
    "react/prop-types": 0,
    "react/no-string-refs": 0,
    "react/no-direct-mutation-state": 0,
  },
};
