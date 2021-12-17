const { i18n } = require('./next-i18next.config');

const localeSubpaths = {};

/** @type {import('next').NextConfig} */
module.exports = {
  i18n,
  publicRuntimeConfig: {
    localeSubpaths,
  },
  reactStrictMode: true,
}
