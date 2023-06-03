module.exports = {
  extends: ["next/core-web-vitals", "turbo", "plugin:prettier/recommended"],
  plugins: ["simple-import-sort"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "prettier/prettier": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react-hooks/rules-of-hooks": "error",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
