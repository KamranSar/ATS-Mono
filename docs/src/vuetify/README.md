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
      customProperties: true, // Required for css var used in scrollbar.scss
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

## Scrollbar Colors

Scrollbars are colored `--v-primary-base` by default.

### To remove the color completely

- [ ] Take the `<style/>` tag out of `App.vue`

### To change the color of the scrollbar

- [ ] Change update it in `scrollbar.scss`

:::details
<<< @/../src/styles/scrollbar.scss
:::

## Mobile Breakpoints

**There are cases when our users all have the same devices and the default mobile breakpoints won't always work in our favor without `JavaScript` manipulation.**

When that happens do the following

- [ ] Modify the `thresholds` in `vuetify.js`

:::details
<<< @/../src/plugins/vuetify.js
:::

- [ ] Update the $grid-breakpoint variable in the `variables.scss`.

:::details
<<< @/../src/styles/variables.scss
:::
