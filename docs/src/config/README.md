---
sidebar: auto
---

::: tip
This documentation was last updated for vue-frontend-template v0.5.x
:::

# Config

Inside the `/config` folder is a file called `myApp.js` that exports `{ myApp, defaultAdminRole }`.

The `package.json` requires the following regex to pass: [https://regex101.com/r/hFKllG/1](https://regex101.com/r/hFKllG/1)

## myApp

### name

- **Type:** `String`
- **Default:** `''`
- **Format:** [`^(?:@[a-z0-9-\*~][a-z0-9-\*._~]_/)?[a-z0-9-~][a-z0-9-._~]_$`](https://regex101.com/r/hFKllG/1)
- **Read-Only:** `false`
- **Usage:**\
  `this.$myApp.name` is displayed in the top application bar `AppBar.vue`.\
  This value is actually defaulted to the `name` field in `package.json` and formatted with the `toTileCase` helper.\ The fall back is to an empty string.\
  You can change this directly to suit better your application name.

### appVersion

::: tip
To modify your app version use `npm version major|minor|patch` in a terminal.
:::

- **Type:** `String`
- **Default:** `v???`
- **Read-Only:** `false`
- **Usage:**
  You can find `this.$myApp.appVersion` displayed at the bottom of the left navigation drawer.
  This is pulled from `package.json` and added to `process.env` in `vue.config.js`.

  ```js
  const appVersion = process.env.VUE_APP_VERSION
    ? 'v' + process.env.VUE_APP_VERSION
    : 'v???';
  ```

### gitVersion

- **Type:** `String`
- **Default:** `''`
- **Read-Only:** `true`
- **Usage:**\
  You can find `this.$myApp.gitVersion` displayed at the bottom of the left navigation drawer along with `appVersion`.
  This is pulled using the library `git-describe` and added to `process.env` in `vue.config.js`.

```js
const gitVersion = process.env.VUE_APP_GIT_RAW
  ? appVersion + '.' + process.env.VUE_APP_GIT_RAW
  : '';
```

### cdcrAppID

::: warning
The default value must not be used for production. Follow the guide to register one for your app.
:::

- **Type:** `String`
- **Default:** `c0cf535a-bb4d-4731-94fb-8a4165b1a124`
- **Format:** [`^(?:@[a-z0-9-\*~][a-z0-9-\*._~]_/)?[a-z0-9-~][a-z0-9-._~]_$`](https://regex101.com/r/hFKllG/1)
- **Read-Only:** `false`
- **Usage:**\
   You can find `this.$myApp.cdcrAppID` defined in the `package.json` file.

### publicPath

::: warning
The default value must not be used for production. Follow the guide to register one for your app.
:::

- **Type:** `String`
- **Default:** `/app`
- **Format:** [`^(?:@[a-z0-9-\*~][a-z0-9-\*._~]_/)?[a-z0-9-~][a-z0-9-._~]_$`](https://regex101.com/r/hFKllG/1)
- **Read-Only:** `false`
- **Usage:**\
   You can find `this.$myApp.publicPath` defined in the `package.json` file.

### appType

- **Type:** `String`
- **Default:** `PWA`
- **Read-Only:** `true`

### isLcl

- **Type:** `Boolean`
- **Default:** `undefined`
- **Read-Only:** `true`
- **Usage:**
  `this.$myApp.isLcl` gets defined via the `window` object `location`

```js
const isLcl = window.location.hostname.includes('localhost'); // (internal only)
```

### isDev

- **Type:** `Boolean`
- **Default:** `undefined`
- **Read-Only:** `true`
- **Usage:**
  `this.$myApp.isDev` gets defined via the `window` object `location`

```js
const isLcl = window.location.hostname.includes('dev'); // (internal only)
```

### isTst

- **Type:** `Boolean`
- **Default:** `undefined`
- **Read-Only:** `true`
- **Usage:**
  `this.$myApp.isTst` gets defined via the `window` object `location`

```js
const isLcl = window.location.hostname.includes('test'); // (internal only)
```

### isPoc

- **Type:** `Boolean`
- **Default:** `undefined`
- **Read-Only:** `true`
- **Usage:**
  `this.$myApp.isPoc` gets defined via the `window` object `location`

```js
const isLcl = window.location.hostname.includes('poc'); // (internal only)
```

### isPrd

- **Type:** `Boolean`
- **Default:** `undefined`
- **Read-Only:** `true`
- **Usage:**
  `this.$myApp.isPrd` is true if `isLcl` `isDev` and `isTst` are not.

```js
const isPrd = !isLcl && !isDev && !isTst;
```

### approles

- **Type:** `array`
- **Default:** `[ defaultAdminRole ]`
- **Read-Only:** `false`
- **Usage:**

```js
// Add your application role to the array
{
  name: String,
  description: String,
  priority: Number, // Default: 1 - Highest priority level; NOTE: Cannot assign roles of a higher priority level than your own
}
```

### helpers

- **Type:** `object`
- **Default:** `{}`
- **Read-Only:** `false`
- **Usage:**
  Feel free to use this helpers object as a way to define global helper functions throughout your Vue components.
  These helpers can then be accessed via `this.$myApp.helpers.reverseText()`

```js
helpers: {
  reverseText: function (text) {
    return text.split('').reverse().join('');
  },
}
```

## defaultAdminRole

The vue-frontend-template requires at the `defaultAdminRole` be defined in the application.
If the application requires no security, no other roles need to be added.

```js
// TODO: Define a default role for the first logged in user.
const defaultAdminRole = {
  name: 'System Administrator',
  description: 'Gives access to manage users in the application',
  priority: 1, // Default: 1 - Highest priority level
};
```

### name

- **Type:** `String`
- **Default:** `System Administrator`
- **Read-Only:** `false`

### description

- **Type:** `String`
- **Default:** `Gives access to manage users in the application`
- **Read-Only:** `false`

### priority

- **Type:** `Number`
- **Default:** 1
- **Read-Only:** `true`
- **Usage:**\
  The priority is used within the `/admin/users` page to handle cases where a user can't promote themselves to a higher role.

## appFeatures

### LEFT DRAW ENABLED

This feature flag is captures in App.vue and AppBar.vue

### RIGHT DRAW ENABLED

This feature flag is captures in App.vue and AppBar.vue

### BOTTOM BAR ENABLED

This feature flag is captures in App.vue

### WEB SOCKETS ENABLED

::: danger
Currently does not work in production.
:::

Set to true to switch from REST to Web Sockets

### MULTIPLE USER ROLES ENABLED

This feature flag allows assigning multiple roles to a user.

::: details
<<< @/../src/config/appFeatures.js
:::

## Example Config

### Example myApp

**Location:** `@/config/myApp.js`

```javascript
import { toTitleCase } from '@/helpers/index.js';

const isLcl = window.location.hostname.includes('localhost'); // (internal only)
const isDev = window.location.hostname.includes('dev'); // (internal only)
const isTst = window.location.hostname.includes('test'); // (internal and external/public)
const isPoc = window.location.hostname.includes('poc'); // (internal and external/public)

// TODO: Define a default role for the first logged in user.
const defaultAdminRole = {
  name: 'System Administrator',
  description: 'Gives access to manage users in the application',
  priority: 1, // Default: 1 - Highest priority level
};

const appVersion = process.env.VUE_APP_VERSION
  ? 'v' + process.env.VUE_APP_VERSION
  : 'v???';
const gitVersion = process.env.VUE_APP_GIT_RAW
  ? appVersion + '.' + process.env.VUE_APP_GIT_RAW
  : '';

/**
 * This config file is exposed by default as this.$myApp
 * Can also import myApp into a lib file like so:
 * import myApp from "@/config/myApp.js";
 */
var myApp = Object.freeze({
  // Name in package.json is used by default and added as an environment variable
  // The filter toTitleCase is used to convert the name, default delimitter is '-'.
  name: process.env.VUE_APP_NAME ? toTitleCase(process.env.VUE_APP_NAME) : '',
  appVersion, // Update using `npm version major|minor|patch`
  gitVersion,
  cdcrAppID: process.env.VUE_APP_CDCR_APP_ID, // TODO: Request your cdcrAppID from dashboard
  publicPath: process.env.VUE_APP_PUBLIC_PATH, // TODO: Define the publicPath in package.json
  appType: 'PWA',
  isLcl,
  isDev,
  isTst,
  isPoc,
  isPrd: !isLcl && !isDev && !isTst,
  approles: [
    // TODO: Add your application roles here
    /* {
      name: String,
      description: String,
      priority: Number, // Default: 1 - Highest priority level; NOTE: Cannot assign roles of a higher priority level than your own
    } */
    defaultAdminRole,
    {
      name: 'Example Role',
      description:
        'Generic application role, change this to suit your app needs',
      priority: 999,
    },
  ],
  helpers: {
    // reverseText: function (text) {
    //   return text.split('').reverse().join('');
    // },
  },
});

export default myApp;

export { defaultAdminRole, myApp };
```

### Example appFeatures

**Location:** `@/config/appFeatures.js`

```javascript
const LEFT_DRAW_ENABLED = true;
const RIGHT_DRAW_ENABLED = false;
const BOTTOM_BAR_ENABLED = false;
const WEB_SOCKETS_ENABLED = false;

export {
  LEFT_DRAW_ENABLED,
  RIGHT_DRAW_ENABLED,
  BOTTOM_BAR_ENABLED,
  WEB_SOCKETS_ENABLED,
};
```
