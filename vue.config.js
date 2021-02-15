module.exports = {
  transpileDependencies: ['vuetify', 'vuex-persist'],

  devServer: {
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
};
