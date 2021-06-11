<img src="./public/img/logo.svg" alt="CDCR Logo" width="64" height="64" />

Table of Contents

- [Directory Structure](#directory-structure)
- [Start your development](#start-your-development)
  - [Creating a CDCR App ID](#creating-a-cdcr-app-id)
  - [Adding API Permissions](#adding-api-permissions)
  - [Change the app name](#change-the-app-name)
  - [Customizing your app theme](#customizing-your-app-theme)
  - [Resize your logo for PWA](#resize-your-logo-for-pwa)
  - [Create your first route and component.](#create-your-first-route-and-component)
  - [Adding Users to your App.](#adding-users-to-your-app)
  - [Adding roles to your App](#adding-roles-to-your-app)
  - [Assigning roles to users](#assigning-roles-to-users)
  - [Creating ACLS to work with your roles](#creating-acls-to-work-with-your-roles)
  - [Using roles to protect your app](#using-roles-to-protect-your-app)
    - [Protecting your route](#protecting-your-route)
    - [Protect your buttons](#protect-your-buttons)
    - [Protect it with JavaScript](#protect-it-with-javascript)
- [Optional Toolkits](#optional-toolkits)
  - [Creating a Vuex module](#creating-a-vuex-module)
  - [Persist your Vuex Module](#persist-your-vuex-module)
  - [Use vuex-pathify](#use-vuex-pathify)
  - [Accessing your Feathers Service](#accessing-your-feathers-service)
- [FAQ](#faq)
  - [When to Fork vs Clone?](#when-to-fork-vs-clone)
  - [What's the difference between a git `clone` and `fork`.](#whats-the-difference-between-a-git-clone-and-fork)
  - [How to pull in updates from vue-frontend-template](#how-to-pull-in-updates-from-vue-frontend-template)
    - [Tips:](#tips)
  - [How to update the application version in package.json](#how-to-update-the-application-version-in-packagejson)
  - [Why am I getting errors from `api/auth/v1/authentication`](#why-am-i-getting-errors-from-apiauthv1authentication)

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
│   │       ├── components
│   │       ├── helpers
│   │       ├── router - Default routes
│   │       └── store
│   │           ├── modules
│   │           └── plugins
│   ├── feathers - Exported feathers services
│   │   ├── helpers - findAll helper
│   │   └── services
│   │       ├── example
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
        ├── plugins
        ├── specs
        └── support
```

# Start your development

## Creating a CDCR App ID

- Default is 12345.
- Every application requires one.
- Developers can recycle them as needed.
  - The moment you check it in, every other developer will have to start using that as well.

* [ ] Visit http://localhost:3000

- This will take you to our local backend server.
- Make sure you have your `database-template` running
  - See README.md

* [ ] Sign in to Azure with your admin account. (ex. `a_nurthin.aziz@cdcr.ca.gov`)
* [ ] Get MT Access Token
* [ ] Generate New App ID
* [ ] Give it a description
* [ ] Save the App ID to your `@/config/myApp.js` file.

## Adding API Permissions

All developers that do not have the following account can request one from the Network team.

With your admin account logged in (ex. `a_nurthin.aziz@cdcr.ca.gov`)..

- [ ] Click `Get API Master List`

* A checkbox with the text `auth` should show on the left, and a empty list view on the right.
  - Clicking `auth` will expand the panel to render a tree view.
  - This should be empty for your generated app id.

- [ ] Select the APIs that your application requires.
- Expand the API to see its `find`, `get`, `create`, `update`, `patch`, and `remove` permissions.
- [ ] Click `Update/Create API Permissions` to save changes.
- [ ] Log out and log back into your frontend application to get its new token and api permissions.

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

## Adding Users to your App.

- [ ] Users will be able to log in with their cdcr credentials (`first.last@cdcr.ca.gov`), but they will not be assigned a role.

## Adding roles to your App

In `@/config/myApp.js` you'll find `approles`.

- [ ] Define your own application roles by providing an object with a name and description.

```javascript
// @/config/myApp.js

...

var myApp = Object.freeze({
  ...
  approles: [
    // TODO: Add your application roles here
    /* {
      name: String,
      description: String
    } */
    {
      name: 'example-role',
      description:
        'Generic application role, change this to suit your app needs',
    },
  ],
});

...
```

NOTE: The defaults can be found in `@/config/private/acl/roles.js`.

## Assigning roles to users

- [ ] When you log in with your `a_first.last@cdcr.ca.gov` account, you automatically have the correct permissions to manage users and their roles.
- [ ] With your `a_...` account will give you access to the page `/Users` in the application.

- This view shows all the users that have logged in at least once into the application and the roles that they come with.

## Creating ACLS to work with your roles

`approles` in `myApp` should couple with the acls you define in `@/acls/index.js`

```javascript
// @/acl/index.js

...

const acls = (acl) => {
  // Add your own acls here...
  acl.rule(
    'if-example-role',
    (user) => user && user.approles && user.approles.includes('example-role')
  );
};

...
```

## Using roles to protect your app

`approles` in `myApp` should couple with the acls defined in `@/acls/index.js`

You can learn more about the usage of these acls from [vue-browser-acl](https://github.com/mblarsen/vue-browser-acl#usage)

### Protecting your route

You can protect a route from being accessed without the proper acl with the `meta` property in `@/router/routes.js`

```javascript
{
  icon: 'mdi-lock',
  path: '/secret',
  name: 'Secret',
  component: () => import(/* webpackChunkName: "secret" */ '@/views/Secret.vue'),
  beforeEnter: requireToken, // If user has a token(is logged in.)
  /** vue-browser-acl meta */
  meta: { // Optional
    can: 'if-example-role',
    fail: '4oh4',
  },
}
```

### Protect your buttons

You can make it so any HTML can be hidden, similar to `v-if`.

```html
<button v-can="['is-admin', 'is-user-manager']">Update Roles</button>
<button v-can="'is-admin'">Create</button>
```

### Protect it with JavaScript

```javascript
if (this.$can('is-admin')) {
  this.$feathers.service(...).find({query: {...}});
}
```

# Optional Toolkits

## Creating a Vuex module

- [ ] Copy `@/store/modules/example.js` to create your first vuex module.

These are automatically imported into `@/store/modules/index.js`.

You can access it using `vuex-pathify`.

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

## Persist your Vuex Module

**These are automatically encrypted by compression during production!**

- [ ] _If you want to_, persist it by adding it to the `modules` array in `cookies.js`, `indexedDB.js`, or `localStorage.js` under `@/store/plugins/`

## Use vuex-pathify

Using `vuex-pathify`, modifying and accessing state is easy!

See more at [vuex-pathify](https://davestewart.github.io/vuex-pathify/#/api/component?id=api).

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

## Accessing your Feathers Service

[Feathers Querying Doc](https://docs.feathersjs.com/api/databases/querying.html)

- [ ] Create a backend feathers service to hook into and call APIs with

- [ ] Copy the folder `@/feathers/services/example` and change the file names and the `servicePath` variable in `example.service.js`

Use it like so in Vue

```javascript
import exampleService from "@/feathers/services/example/example.service.js";
async mounted() {
    this.myData = await exampleService.find({
        query: {
            stale: false,
            dataId: {
                $in: [ 1, 3, 4, 5]
            }
        }
    });
}
```

# FAQ

## When to Fork vs Clone?

- **Fork** - when you're creating a project in devops for the first time.

- **Clone** - when you're pulling down the project you just forked in devops to your local machine.
  - Because a `git clone` does not bring down any upstream branches, git will tell you to run the command below:

```
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
```

## What's the difference between a git `clone` and `fork`.

Creating a fork will link your newly created repository and the repository you forked from.

- The benefit to this is when creating a `Pull Request`, devops is smart enough to your repository was forked.
  - This allows you to pull in changes bi-directionally.
  - This is great for pulling in updates.

```
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
```

Doing a `git clone https://...` of a project will only provide you a copy.

- This is great for testing or working on a project.
- Does not bring in any remote upstreams
- If the project is forked, `git clone` will give you the command to add it if available.

## How to pull in updates from vue-frontend-template

```sh
# 1. Check that you don't already have an upstream remote pointing to:
# https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
git remote -v

# 2. Add it otherwise
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template

# 3. Merge in changes from vue-frontend-template.
git fetch upstream main
git merge --squash upstream/main # Resolve any merge conflicts
```

### Tips:

- Use `git fetch upstream main` to check for updates.
- Select the **Accept all incoming.** option when dealing with merge conflicts in `@/config/private/`.
- All other merge conflicts should be handled normally.

## How to update the application version in package.json

```sh
# Starting from version 0.0.1 in package.json
npm version patch # Bumps to 0.0.2
npm version minor # Bumps to 0.1.0
npm version major # Bumps to 1.0.0
# When you're ready, and it's been pushed. Tag it directly in devops.
```

## Why am I getting errors from `api/auth/v1/authentication`

_Assuming you're on your local machine..._

Make sure you have the MT server running and try again.

```sh
# Navigate to your database-template
cd ~/code/database-template
git pull
npm install
./scripts/start_test_servers.sh
npm run dev
```
