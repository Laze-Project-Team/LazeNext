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

    config.module.rules.push(
      {
        test: /\.md/,
        use: ['raw-loader'],
      },
      {
        test: /\.laze/,
        use: ['raw-loader'],
      }
    );

    return config;
  },

  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/first',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
      {
        source: '/signup_complete',
        destination: '/',
        permanent: true,
      },
      {
        source: '/logout',
        destination: '/',
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
  env: {
    GTM_ID: process.env.GTM_ID,
  },
});
