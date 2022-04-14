process.env.VUE_APP_NAME =
  process.env.VUE_APP_NAME || require('./package.json').name;
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_TEMPLATE = require('./package.json').templateVersion;
process.env.VUE_APP_PUBLIC_PATH = require('./package.json').publicPath;
process.env.VUE_APP_CDCR_APP_ID = require('./package.json').cdcrAppID;
const dotenv = require('dotenv');
dotenv.config({ path: './gitinfo' });
process.env.VUE_APP_GIT_HASH = process.env.GIT_HASH;
process.env.VUE_APP_GIT_DATE = process.env.GIT_DATE;
const { themes } = require('./src/plugins/themes.js');

module.exports = {
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
      // https://github.com/johngodley/webpack-remove-debug
      // https://github.com/survivejs/webpack-merge
      // https://cli.vuejs.org/guide/webpack.html#adding-a-new-loader
      // https://cli.vuejs.org/guide/webpack.html#inspecting-the-project-s-webpack-config
      // This works, but the app won't run due to requiring debug
      // return {
      //   module: {
      //     rules: [
      //       {
      //         test: /\.js$/,
      //         loader: 'webpack-remove-debug',
      //       },
      //     ],
      //   },
      // };
    } else {
      // mutate for development...
    }
  },
  transpileDependencies: ['vuetify', 'vuex-persist'],
  lintOnSave: true,
  integrity: false, // enable Subresource Integrity (SRI) on <link rel="stylesheet"> and <script> tags in generated HTML.
  // crossorigin: "anonymous",
  // crossorigin: "use-credentials",
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  productionSourceMap: false,

  devServer: {
    // Some warnings are getting thrown after the release of Prettier 2020
    overlay: {
      warnings: false,
      errors: false,
    },
    open: false, // Open a browser automatically
    port: 8080,
    host: '0.0.0.0',
    useLocalIp: true, // This option lets the browser open with your local IP (localhost)
    quiet: false,
    // https: true,
    https: false,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods':
        'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
      Vary: 'origin',
    },
    stats: { colors: true },
    // https://webpack.js.org/configuration/dev-server/  - Options for proxying
    proxy: {
      '^/api': {
        changeOrigin: true,
        cookieDomainRewrite: '',
        cookiePathRewrite: '',
        target: process.env.VUE_APP_PROXY_TARGET,
      },
      '^/ws/api': {
        target: String(process.env.VUE_APP_PROXY_TARGET)
          .replace('http', 'ws')
          .replace('https', 'ws'),
        ws: true,
      },
    },
  },

  pluginOptions: {
    UglifyJsPlugin: {
      output: {
        ascii_only: true,
      },
    },
  },

  pwa: {
    name: process.env.VUE_APP_NAME,
    themeColor: themes.light.primary,
    msTileColor: themes.light.accent,
    appleMobileWebAppStatusBarStyle: 'default',
    appleMobileWebAppCapable: 'yes',
    assetsVersion: '',
    manifestOptions: {
      start_url: '.',
      display: 'standalone',
    },
    workboxOptions: {
      navigateFallback: 'index.html',
    },
    manifestCrossorigin: 'anonymous',
  },
};
