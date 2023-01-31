/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: 'always',
  printWidth: 120,
  singleQuote: true,
  jsxBracketSameLine: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  // tailwindConfig: "./packages/config/tailwind",
};
