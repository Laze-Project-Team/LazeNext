const { i18n } = require('./next-i18next.config');

const localeSubpaths = {};

/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // moment.jsのignore設定
    config.plugins.push(new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }));
    
    return config;
  },

  i18n,
  publicRuntimeConfig: {
    localeSubpaths,
  },
  reactStrictMode: true,
}