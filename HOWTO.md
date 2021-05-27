<img src="./public/img/logo.svg" alt="CDCR Logo" width="64" height="64" />

Table of Contents

- [Directory Structure](#directory-structure)
- [Start your development](#start-your-development)
  - [Change the app name](#change-the-app-name)
  - [Customizing your app theme](#customizing-your-app-theme)
  - [Resize your logo for PWA](#resize-your-logo-for-pwa)
  - [Create your first route and component.](#create-your-first-route-and-component)
- [Optional Toolkits](#optional-toolkits)
  - [Vuex](#vuex)
    - [Use vuex-pathify to easily interact with vuex modules](#use-vuex-pathify-to-easily-interact-with-vuex-modules)
  - [Feathers](#feathers)

# Directory Structure

Below outlines the default directory structure the template comes with:

```
.
├── public
│   └── img
│       └── icons - Application logo
├── scripts - Script to resize your png or svg to icon sizes needed.
├── src - Application Code
│   ├── acl - vue-browser-acl folder
│   ├── components - Vue components live here
│   │   ├── layouts
│   │   │   └── navigation
│   │   │       └── helpers
│   │   └── util
│   ├── compositions - Vue 3 ready composition functions
│   ├── config - Application configuration folder (myApp.js)
│   │   └── private - Underlying template code available for use but.. DO NOT MODIFY
│   │       ├── acl - Default roles and acls
│   │       ├── components
│   │       ├── helpers
│   │       ├── router - Default routes
│   │       └── store
│   │           ├── modules
│   │           └── plugins
│   ├── feathers - Exported feathers services
│   │   ├── hooks
│   │   └── services
│   │       ├── heartbeat
│   │       └── users
│   ├── filters - toTileCase
│   ├── mixins - PWA Install Mixin
│   ├── plugins - Plugins live here (Vuetify.js)
│   ├── router - Vue Router folder
│   │   └── helpers
│   ├── store - Vuex store uses VuexPersistence
│   │   ├── modules
│   │   └── plugins
│   └── views - Router Views (See router/navItems.js)
│       └── Admin - For appuserroles
└── tests - Cypress e2e testing
    └── e2e
        ├── plugins - Resuables tests
        ├── specs - Test files
        └── support - User defined helpers
```

# Start your development

## Change the app name

- [ ] Change the name in `package.json`

- Because of the name limitations on package.json, the template uses a filter `@/filters/toTitleCase` with a default delimitter of `'-'`. You can find where it's being used at `@/config/myApp.js`

This can then be accessed via `this.$myApp` or imported in another JavaScript file:

```javascript
import myApp from '@/config/myApp.js';
console.log('myApp: ', myApp.name);
```

## Customizing your app theme

- [ ] Change vuetify to the theme of your app in `@/plugins/vuetify.js`

- If you desire to change the bar colors, you can do so in the navigation components, `@/components/layouts/navigation/`. There you will find `AppBar.vue`, `BottomNavBar.vue`, `NavDrawerLeft.vue`, and `NavDrawerRight.vue`.

NOTE: _As you change the color property on the navigation components directly, be sure to see what it looks like in dark mode and if the front color is still legible._

## Resize your logo for PWA

- [ ] _If you have one_, convert your logo to the appropriate sizes

```sh
# This creates a directory called image_resize inside scripts.
# It expects a single argument pointing to a .svg or .png and converts
# them to the appropriate size for PWA.
cd scripts
chmod +x image_resize.sh # Give the script permissions to execute

./image_resize.sh ~/Documents/Icons/logo.png
# Take the converted images in image_resize and move them to /public/img/icons
```

## Create your first route and component.

- [ ] Start by creating a new route in `@/router/routes.js`.
  - [ ] Add it to `anonymousItems`, `userItems`, `adminItems`, or `userToolbarItems` at the bottom of `@/router/routes.js`.

```javascript
import { requireToken } from '@/router/helpers/guards.js';
{
  /** custom application properties
   * These can be expanded beyond the default: icon, and onClick properties.
   * Just be sure the '@/components/navigation/' components are updated appropriately.
   */
  icon: 'mdi-home',
  onClick: () => alert('Roll for initiative!'), // Set path to '' for onClick to fire.
  /** vue-router properties */
  path: '/home',
  name: 'Home',
  component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  beforeEnter: requireToken, // If user has a token(is logged in.)
  // redirect: String // Optional
  /** vue-browser-acl meta */
  meta: { // Optional
    can: 'if-admin',
    fail: '4oh4',
  },
},
```

# Optional Toolkits

## Vuex

- [ ] Copy `@/store/modules/example.js` to create your first vuex module
- [ ] _If you want to_, persist it by adding it to the `modules` array in `cookies.js`, `indexedDB.js`, or `localStorage.js` under `@/store/plugins/`

```javascript
// @/store/modules/example.js
import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    exampleData: { foo: 1, bar: 2 },
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },
};

// Vuex Store
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
```

### Use vuex-pathify to easily interact with vuex modules

```javascript
import { sync, get } from "vuex-pathify";
computed: {
    ...sync("app", ["loading"]), // @/store/modules/app.js
    ...get("users", ["user"]), // @/store/modules/users.js
},
methods: {
    onClick() {
        this.loading = true;
        setTimeout(() => {
            console.log("User: ", user);
            this.loading = false;
        }, 300)
    }
}
```

## Feathers

- [ ] Create a feathers service to hook into and call APIs with

1. Create a new directory named after your service under @/feathers/services
2. Copy @/feathers/services/heartbeat/heatbeat.service.js into your new directory
3. Rename the file {servicename}.service.js
4. Change the servicePath to match yours in the file.
5. Use it like so in Vue

```javascript
import myservice from "@/feathers/services/my/my.service.js";
async mounted() {
    this.myData = await myservice.find({
        query: {
            stale: false,
            dataId: {
                $in: [ 1, 3, 4, 5]
            }
        }
    });
}
```
