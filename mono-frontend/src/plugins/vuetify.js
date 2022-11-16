/**
 * Global vuetify preset
 * Vuetify is accessible by default via this.$vuetify
 *
 * https://vuetifyjs.com/en/features/presets/
 */
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
const { themes } = require('./themes.js');
Vue.use(Vuetify);

export default new Vuetify({
  breakpoint: {
    // ! REMINDER: Update @/styles/variables.scss when updating these thresholds
    thresholds: {
      xs: 340,
      sm: 540,
      md: 800,
      lg: 1280,
    },
  },
  theme: {
    options: {
      // https://vuetifyjs.com/en/features/theme/#custom-properties
      customProperties: true,
      // FIXME: Dynamically turn this when process.NODE_ENV === 'production'
      // https://vuetifyjs.com/en/features/theme/#caching
      // themeCache: {
      //   get: (key) => localStorage.getItem(key),
      //   set: (key, value) => localStorage.setItem(key, value),
      // },
    },
    themes,
  },
  icons: {
    iconfont: 'mdi',
  },
});
