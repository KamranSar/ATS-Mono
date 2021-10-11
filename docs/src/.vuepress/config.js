const { description } = require('../../package');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Automated Transfer System',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#4B6858' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template',
    docsDir: 'docs',
    docsBranch: 'v0.5.6_WIP',
    editLinks: false,
    docsDir: '',
    editLinkText: 'Report an issue!',
    lastUpdated: false,
    nav: [
      {
        text: 'Learn',
        items: [
          {
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'Vuetify',
            link: '/vuetify/',
          },
          {
            text: 'PWA',
            link: '/pwa/',
          },
          {
            text: 'Routing',
            link: '/routing/',
          },
          {
            text: 'Vuex',
            link: '/vuex/',
          },
          {
            text: 'Feathers',
            link: '/feathers/',
          },
          {
            text: 'User Management',
            link: '/users/',
          },
          {
            text: 'Authentication',
            link: '/authentication/',
          },
          { text: 'Utilities & More', link: '/utilities/' },
          {
            text: 'Directory Structure',
            link: '/directory/',
          },
        ],
      },
      {
        text: 'App Registration',
        link: '/app_registration/',
      },
      {
        text: 'Config',
        link: '/config/',
      },
      {
        text: 'Resources',
        items: [
          {
            text: 'Git Fork',
            link: 'https://docs.microsoft.com/en-us/azure/devops/repos/git/forks?view=azure-devops&tabs=visual-studio',
          },
          {
            text: 'Vuetify',
            link: 'https://vuetifyjs.com/en/features/theme/#customizing',
          },
          {
            text: 'Vue Router',
            link: 'https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields',
          },
          {
            text: 'Vuex',
            link: 'https://vuex.vuejs.org/guide/#the-simplest-store',
          },
          {
            text: 'Vuex Persist',
            link: 'https://championswimmer.in/vuex-persist/',
          },
          {
            text: 'Vuex Pathify',
            link: 'https://davestewart.github.io/vuex-pathify/#/?id=home',
          },
          {
            text: 'Feathers Querying',
            link: 'https://docs.feathersjs.com/api/databases/querying.html',
          },
          {
            text: 'Feathers Services',
            link: 'https://docs.feathersjs.com/api/services.html#service-methods',
          },
          {
            text: 'date-fns',
            link: 'https://date-fns.org/docs/Getting-Started',
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: ['', 'using-vue'],
        },
      ],
    },
  },

  /**
   * Markdown config
   */
  markdown: {
    lineNumbers: true,
    extendMarkdown: (md) => {
      md.use(require('markdown-it-task-lists'));
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
