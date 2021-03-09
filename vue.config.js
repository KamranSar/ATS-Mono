process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_NAME =
  process.env.VUE_APP_NAME || require('./package.json').name;

module.exports = {
  transpileDependencies: ['vuetify', 'vuex-persist'],
  lintOnSave: true,
  integrity: false, // enable Subresource Integrity (SRI) on <link rel="stylesheet"> and <script> tags in generated HTML.
  // crossorigin: "anonymous",
  // crossorigin: "use-credentials",
  publicPath: '/',
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
    // https://webpack.js.org/configuration/dev-server/  - For options for proxying

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        timeout: 6000,
        secure: false,
        changeOrigin: true,
      },
    },
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: ['/', '/404', '/about', '/privacy-policy', '/terms'],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
    },
    UglifyJsPlugin: {
      output: {
        ascii_only: true,
      },
    },
  },

  pwa: {
    name: process.env.VUE_APP_NAME,
    themeColor: '#0200FF',
    msTileColor: '#4A90E2',
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
