const path = require('path');

module.exports = {
  require: [path.join(__dirname, 'styleguide.config/global.requires.js')],
  renderRootJsx: path.join(__dirname, 'styleguide.config/styleguide.root.js'),
  title: 'Vue Frontend Template Component Guide',
  components: [
    'src/components/**/[A-Z]*.vue',
    'local_modules/vue-frontend/components/**/[A-Z]*.vue',
  ],
  ribbon: {
    text: '+1 AC',
  },
  version: '1.1.1',
  displayOrigins: true,
  defaultExample: true,
  usageMode: 'expand',
  exampleMode: 'expand',
  template: {
    head: {
      links: [
        {
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css',
          rel: 'stylesheet',
        },
      ],
    },
  },
  compilerConfig: {
    target: { ie: 11 },
  },
  styleguideDir: 'dist',
  /**
   * load a color scheme
   */
  // theme: 'styleguide.config/vueds-theme.js',
  // styles: 'styleguide.config/vueds-styles.js',
};
