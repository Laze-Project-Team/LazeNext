const withTM = require('next-transpile-modules')(['monaco-editor-core']);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { i18n } = require('./next-i18next.config');

const localeSubpaths = {};

/** @type {import('next').NextConfig} */
module.exports = withTM(
  withBundleAnalyzer({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // moment.jsのignore設定
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        })
      );

      config.resolve.alias.vscode = require.resolve('@codingame/monaco-languageclient/lib/vscode-compatibility');

      return config;
    },

    async redirects() {
      return [
        {
          source: '/docs',
          destination: '/docs/first',
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
  })
);
