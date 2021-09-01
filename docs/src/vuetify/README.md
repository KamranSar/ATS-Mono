---
sidebar: auto
---

# Vuetify

The vuetify plugin for our css framework is installed under `@/plugins/vuetify.js`

## Example Vuetify Config

```js
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
```

## Theming

The application theme is also used for PWA install. The border color will reflect according to what's set it for `themeColor` and `msTileColor` in `@/vue.config.js`

### Example Theme

**Location:** `@/plugins/themes.js`

```js
const themes = Object.freeze({
  light: {
    primary: '#1976D2', // Blue
    secondary: '#424242', // Dark Grey
    accent: '#82B1FF', // Light-Blue
    error: '#FF5252', // Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FFC107', // Yellow
  },
  dark: {},
});

// This file gets imported into vue.config.js.
// vue.config.js does not support ES Modules.
module.exports = {
  themes,
};
```

By default their values are set to primary and accent in `vue.config.js`.

```
themeColor: themes.light.primary,
msTileColor: themes.light.accent,
```

- **Usage:**

```html
<!-- Use it in a color attribute -->
<v-btn color="success">Hello World</v-btn>

<!-- Or apply it as a class -->
<v-btn class="error">Hello World</v-btn>
```
