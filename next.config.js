const { i18n } = require("./next-i18next.config");
const withTM = require("next-transpile-modules")([
  "@uiw/react-markdown-preview",
  "@uiw/react-md-editor",
]); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  i18n,
});
