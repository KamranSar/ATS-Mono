/**
 * Global vuetify preset
 * Vuetify is accessible by default via this.$vuetify
 *
 * https://vuetifyjs.com/en/features/presets/
 */
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

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
    themes: {
      light: {
        primary: '#1976D2', // Blue
        secondary: '#424242', // Dark Grey
        accent: '#82B1FF', // Light-Blue
        error: '#FF5252', // Red
        info: '#2196F3', // Blue
        success: '#4CAF50', // Green
        warning: '#FFC107', // Yellow
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
