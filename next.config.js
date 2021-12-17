const { i18n } = require('./next-i18next.config');
const { nextI18NextRewrites } = require('next-i18next/rewrites');

const localeSubpaths = {};

/** @type {import('next').NextConfig} */
module.exports = {
  i18n,
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
  reactStrictMode: true,
}
