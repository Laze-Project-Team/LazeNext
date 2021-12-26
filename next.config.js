const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { i18n } = require('./next-i18next.config');

const localeSubpaths = {};

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // moment.jsのignore設定
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    return config;
  },

  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/home',
        permanent: true,
      },
    ];
  },

  i18n,
  publicRuntimeConfig: {
    localeSubpaths,
  },
  staticPageGenerationTimeout: 1000,
  reactStrictMode: true,
});
