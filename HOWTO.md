<img src="./public/img/logo.svg" alt="CDCR Logo" width="64" height="64" />

```
At the time of this writing....
This HOWTO.md is up to date with template version 0.5
```

Table of Contents

- [What is this? :information_desk_person:](#what-is-this-information_desk_person)
- [Directory Structure :open_file_folder:](#directory-structure-open_file_folder)
- [Starting from scratch... :hatching_chick:](#starting-from-scratch-hatching_chick)
  - [CREATING A BRANCH NEW PROJECT](#creating-a-branch-new-project)
- [Start your development :running:](#start-your-development-running)
  - [Name your application](#name-your-application)
  - [Apply your application themes](#apply-your-application-themes)
  - [Adding your logo to the app](#adding-your-logo-to-the-app)
  - [Create your first commit and push the changes:](#create-your-first-commit-and-push-the-changes)
  - [Application routing and how to](#application-routing-and-how-to)
    - [Navigating and viewing the available routes:](#navigating-and-viewing-the-available-routes)
    - [Creating your first route.](#creating-your-first-route)
  - [Creating a Vuex module](#creating-a-vuex-module)
  - [Using vuex-pathify to access your module states.](#using-vuex-pathify-to-access-your-module-states)
  - [Persist your Vuex Module](#persist-your-vuex-module)
  - [Creating a feathers service](#creating-a-feathers-service)
    - [Creating a MongoDB Service](#creating-a-mongodb-service)
    - [Creating a Mongoose Service.](#creating-a-mongoose-service)
  - [Accessing your Feathers Service](#accessing-your-feathers-service)
  - [Request/Register your `azureAppID` and `publicPath`](#requestregister-your-azureappid-and-publicpath)
  - [Giving your application API permissions](#giving-your-application-api-permissions)
  - [Adding Users to your App.](#adding-users-to-your-app)
  - [Adding roles to your App](#adding-roles-to-your-app)
  - [Assigning roles to users](#assigning-roles-to-users)
  - [Creating ACLS to work with your roles](#creating-acls-to-work-with-your-roles)
  - [Using roles to protect your app](#using-roles-to-protect-your-app)
    - [Protecting your route](#protecting-your-route)
    - [Protect your buttons](#protect-your-buttons)
    - [Protect it with JavaScript](#protect-it-with-javascript)
    - [Updating your application template](#updating-your-application-template)
- [FAQ :question:](#faq-question)
  - [When to Fork vs Clone?](#when-to-fork-vs-clone)
  - [What's the difference between a git `clone` and `fork`.](#whats-the-difference-between-a-git-clone-and-fork)
  - [How to pull in updates from vue-frontend-template](#how-to-pull-in-updates-from-vue-frontend-template)
    - [Tips:](#tips)
  - [How to update the application version in package.json](#how-to-update-the-application-version-in-packagejson)
  - [Why am I getting errors from `api/auth/v1/authentication`](#why-am-i-getting-errors-from-apiauthv1authentication)
  - [Why does the app name in the browser title show up with delimitters?](#why-does-the-app-name-in-the-browser-title-show-up-with-delimitters)
  - [How can I access my Vue app through dev tools?](#how-can-i-access-my-vue-app-through-dev-tools)
- [Other Source Documentation :information_source:](#other-source-documentation-information_source)
  - [Git Fork](#git-fork)
  - [Vuetify](#vuetify)
  - [Vue Router](#vue-router)
  - [Vue Browser ACL](#vue-browser-acl)
  - [Vuex](#vuex)
  - [Vuex Persist](#vuex-persist)
  - [Vuex Pathify](#vuex-pathify)
  - [Feathers Client](#feathers-client)
  - [date-fns](#date-fns)

# What is this? :information_desk_person:

This repository is a starter project based on -

1. Vue CLI
2. Vue Router
3. Vuex + Vuex Pathify + Vuex Persist
4. Vuetify
5. Feathers Client for APIs
6. vue-browser-acl for ACLs
7. date-fns

The template is put together to provide out of the box:

1. Light/Dark Mode
2. MFA
3. Navigation/Routing
4. Data Encryption
5. Persistence to disk
6. Easy CRUDS for API
7. Auto-registration of vuex modules
8. Auto registration of routes\
   and more...

# Directory Structure :open_file_folder:

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
│   │   ├── Users - User Management page
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
│   │       ├── accountsbyapp
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

# Starting from scratch... :hatching_chick:

These steps will walk you through starting a brand new application from scratch.\
The end result is everything that comes out of the box with the `vue-frontend-template`.\
Check out [Start your development](#start-your-development) section after, to get started on making it your own.

## CREATING A BRANCH NEW PROJECT

- [ ] Navigate to https://dev.azure.com/cdcr and click the `+ New Project` button
  - Give it a project name and description
- [ ] Navigate to the following URL:
      https://dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
- [ ] Click the verticle ellipsis to bring up the `Fork` option
- [ ] Select `Fork` and save it in your new Project.
  - Branches to include:
    - Only the default branch (main)
- [ ] After forking it will take you to the new repository.
  - We're ready to clone.. click `Clone`
- [ ] Copy the `GIT_URL` next to `HTTPS|SSH`
- [ ] In a terminal paste the following:

- Remember to replace `GIT_URL` with your own.

```sh
git clone `GIT_URL`
```

8. `cd` into your project directory after `git clone...`

- Run the following in your project folder.

```sh
npm install # install any package.json dependencies
npm run start-servers # Start the local mt backend with the start-servers script in package.json
npm run serve # Start the local frontend webserver with the serve script in package.json
```

9. Navigate to http://localhost:8080/app

# Start your development :running:

This section will focus first on getting you up and running for frontend development.\
Towards the end of the section, we will focus on everything MiddleTier... App Registration, API Permissions, Database templates etc.

## Name your application

- [ ] Change your `name` in `package.json`

- By default the `name` as it's shown in your application is derived from `package.json`
- If this does not suffice, you can also change it explicitly in `myApp.js`
- Regardless of `myApp.name` the `public/index.html` will always reference `package.json`, you may also explicitly change this if desired in `public/index.html`.
- `package.json` has a boundary requiring the `name` to pass the following regex:
  - https://regex101.com/r/hFKllG/1

```
^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$
```

- [ ] Change `vue-frontend-template` in `README.md` for your project name.
- [ ] Access it in a `.vue` file with `this.$myApp` or import in another `.js` file:

```javascript
import myApp from '@/config/myApp.js';
console.log('myApp: ', myApp.name);
```

- **NOTE**: Do not change the `publicPath` in `package.json` until you've registered your `azureAppID` in `"@/config/myApp.js"` with it.

## Apply your application themes

Light and Dark themes are derives from the file `"@/plugins/themes.js"`

- [ ] Change the `primary,secondary,accent,error,info,success and warning` colors as needed.
- If you want to change the bar colors, you can do so in:
  - `@/components/layouts/navigation/AppBar.vue`
  - `@/components/layouts/navigation/BottomNavBar.vue`
  - `@/components/layouts/navigation/NavDrawerLeft.vue`
  - `@/components/layouts/navigation/NavDrawerRight.vue`

NOTE: _Remember to see what it also looks like in dark mode before settling on a theme._

## Adding your logo to the app

- [ ] _If you have one_, add your logo to the app with the following script:

```sh
# This script takes in a single argument pointing to your .svg or .png file.
# A backup of your old public/img/icons folder is created.
# The final product is an updated public/img/icons folder with all the appropriate sizes for PWA.
./scripts/image_resize.sh ~/Documents/Icons/logo.png
```

## Create your first commit and push the changes:

Now is a good time to `stage` all of our changes, give it a good `commit` message and `push` them to devops.

- [ ] Run the following in a terminal:

```sh
git add .
git commit -m "Updated application name, applied application themes, and added logo."
git push
```

## Application routing and how to

### Navigating and viewing the available routes:

- [ ] Launch the app for the first time you're routed to `@/views/Login.vue`.
- [ ] Click `Sign in with Microsoft` and you'll be routed to `@/views/Home.vue`.
- [ ] Click the app logo or your `UserAvatar` to reveal the navigation items derived from `@/router/routes.js` and `@/config/private/router/routes.js`

### Creating your first route.

- [ ] Start by copying the structure below and modying the property values as needed:

```javascript
// VueRouter Object Structure:
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
  // beforeEnter: RouterGuard, // Optional
  // redirect: String // Optional
  /** vue-browser-acl meta */
  meta: { // Optional
    can: 'if-user-admin',
    fail: '4oh4',
  },
},
```

- [ ] Add it to the `routes` array at the top of `@/router/routes.js`.
- [ ] Add it to `anonymousItems`, `userItems`, `adminItems`, or `userToolbarItems` at the bottom of `@/router/routes.js`.
- [ ] Create the component's `.vue` file in `@/views/`

## Creating a Vuex module

`Vuex` is used for state management of your data between components.\
Click [Vuex](#vuex) for documentation.

- [ ] Copy `@/store/modules/example.js` to create your first vuex module.
- [ ] Rename the file to your module name.
- It is also possible to move it into a folder and rename the file `index.js`\
  - The importer will use the foldername as the name of your module.
- These are automatically imported via `@/store/modules/index.js`.

## Using vuex-pathify to access your module states.

Use `vuex-pathify` to make modifying and accessing state easy!\
Click [Vuex Persist](#vuex-persist) for documentation.

```javascript
// In any .vue file...
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

## Persist your Vuex Module

- [ ] Add your `vuex module name` to the `modules` array in any of these files:
- `@/store/plugins/cookies.js`
- `@/store/plugins/indexedDB.js`
- `@/store/plugins/localStorage.js`\
  NOTE: _Only `indexedDB` is automatically encrypted by compression during production!_

## Creating a feathers service

There are many connections made available to us by _The Great Sorcerers of the Middle Tier_.\
This guide aids you as an apprentice in the steps required to conjuring your own connections to different server realms such as `MongoDB, Mongoose, MSSQL, Oracle, POSTGRES and others...`

To keep the training simple, we will go over the steps for only `MongoDB and Mongoose`.

### Creating a MongoDB Service

- [ ] Navigate to the [database-template](https://dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/database-template) repo.
  - [ ] Follow `Project Setup` section in the `README.md` file.
- [ ] Switch to the directory in VS Code.
- [ ] Name your MongoDB database in `config/default.json`
- [ ] Navigate to `service-config.js`, your `appPath, docsPath, server and services` section should be updated accordingly like below:

```javascript
// service.config.js

appPath: '/api/servername',
docsPath: '/docs/servername',
server: {
  ...
    mongooseEnabled: false,
    mongodbEnabled: true,
    mssqlEnabled: false,
    oracleEnabled: false,
    postgresEnabled: false,
  },
services: [
    {
      name: 'myservicename',
      version: 'v1',
      enabled: true,
      description: 'My First Service',
    },
]
```

- [ ] Copy the `src/services/mongodbservice_v1` folder
- [ ] Rename the folder and all associated files.

* It is important the folder and file names follow the same naming convention so they can map back to the `name` and `version` under `services` in `service-config.js`

- [ ] Update the `dbCollectionName` appropriately in the `<name>_<version>.class.js` file
- [ ] Move to the [Accessing your Feathers Service](#accessing-your-feathers-service) section to continue

### Creating a Mongoose Service.

TODO:

## Accessing your Feathers Service

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

## Request/Register your `azureAppID` and `publicPath`

- Default is `c0cf535a-bb4d-4731-94fb-8a4165b1a124` and `/app`

  - DO NOT USE THE DEFAULT FOR PRODUCTION.
  - EVERY APPLICATION REQUIRES ONE.
  - The moment you check it in, every other developer will have to start using it as well.
  - Save the `azureAppID` to your `@/config/myApp.js` file.
  - Save the `publicPath` to the `package.json`
  - `package.json` has a boundary requiring the `publicPath` to pass the following regex:
    - https://regex101.com/r/hFKllG/1

```
^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$
```

- **NOTE**: Do not change the `publicPath` in `package.json` until you've registered your `azureAppID` with it.

- [ ] Visit the URL below to request your App ID from Networking Engineering

- TODO: Add the URL to the APP ID form.

## Giving your application API permissions

- [ ] Visit http://localhost:3000

* This will take you to our local backend server.

- [ ] Click `Sign in to Azure`
- [ ] Click `Get MT Access Token`
- [ ] Give it your App ID
- [ ] Click `Get API Master List`

* A tree view should appear on the left with `auth` and `eis` unchecked.
  - Clicking either API endpoint will expand the tree.
  - This should be empty for your generated app id.

- [ ] Select the APIs that your application requires.
- Expand the API to see its `find`, `get`, `create`, `update`, `patch`, and `remove` permissions.
- [ ] Click `Update/Create API Permissions` to save changes.
- [ ] Refresh and sign back in to get a new token with your updated API permissions.

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

### Protecting your route

You can protect a route from being accessed without the proper acl with the `meta` property in `@/router/routes.js`

```javascript
{
  icon: 'mdi-lock',
  path: '/secret',
  name: 'Secret',
  component: () => import(/* webpackChunkName: "secret" */ '@/views/Secret.vue'),
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

### Updating your application template

Add a remote called `upstream` that points to the forked repository.
You can then pull down the latest changes from the template like so.

```sh
git remote -v # Check that you don't already have it
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
git fetch upstream main
git merge --squash upstream/main
```

# FAQ :question:

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

_If this is the first time you're running the MT server..._

- [ ] Connect to F5
- [ ] Bring down the latest images from database-template

```sh
./scripts/get_test_images.sh
```

- [ ] Try running it again

```sh
./scripts/start_test_servers.sh
npm run dev
```

_If you've recently lost connection to F5_

You'll need to do a fast restart of your servers.

- [ ] Run the fast restart script in your server directory

```sh
./scripts/fast_restart.sh
```

## Why does the app name in the browser title show up with delimitters?

This is because of the following code in `/public/index.html`

Webpack automatically pulls the title from the variable `name` in `package.json`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    ...
    <title><%= htmlWebpackPlugin.options.title %></title>
    ...
  </head>
</html>
```

If you want to correct this without the delimitters you can hard code it like so:

```html
<title>My App Name</title>
```

## How can I access my Vue app through dev tools?

By default the Vue application is mounted to an element with the id app.

- [ ] Open DevTools with `Ctrl + Shift + I`
      In the prompt you can create a variable and assign it to app.

This will give you access to the all the components currently rendered via the `<v-main></v-main>` tag in `App.vue`

```javascript
const app = document.getElementById('app').__vue__;
const mainChildren = app.$children.find((c) => c.$refs['main']).$children;
const usersComponent = mainChildren[0]; // Assuming only only component and it's Users.vue
// You can now do something like this...
usersComponent.loading = true;
usersComponent.listOfUsers.forEach((u) => console.log(u));
// ... Directly in dev tools
```

# Other Source Documentation :information_source:

## [Git Fork](https://docs.microsoft.com/en-us/azure/devops/repos/git/forks?view=azure-devops&tabs=visual-studio)

## [Vuetify](https://vuetifyjs.com/en/features/theme/#customizing)

## [Vue Router](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields)

## [Vue Browser ACL](https://blog.cheesefi.com/blog/vue-user-permissions-through-directives/)

## [Vuex](https://vuex.vuejs.org/guide/#the-simplest-store)

## [Vuex Persist](https://championswimmer.in/vuex-persist/)

## [Vuex Pathify](https://davestewart.github.io/vuex-pathify/#/?id=home)

## [Feathers Client](https://docs.feathersjs.com/api/databases/querying.html)

## [date-fns](https://date-fns.org/docs/Getting-Started)
