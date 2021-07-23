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

/** Install the vs code plugin for better color support:
 * Name: Color Highlight
 * Publisher: Sergii Naumov
 * VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight
 */
export default new Vuetify({
  breakpoint: {
    mobileBreakpoint: 'sm', // https://vuetifyjs.com/en/features/breakpoints/#mobile-breakpoints
  },
  theme: {
    themes,
  },
  icons: {
    iconfont: 'mdi',
  },
});
