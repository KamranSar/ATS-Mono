---
sidebar: auto
---

# :school: Introduction

**This guide will walk you through the following:**

- :heart_eyes_cat: Starting a **new project** from scratch
- :name_badge: Adding the **project name** to the app
- :rainbow: Adding **color** to the app
- :black_flag: Adding the application **logo**
- :stop_sign: Pausing to **push and commit** your changes
- :oncoming_taxi: Using **Vue Router**
- :ledger: Using **Vuex** for state management
- :desktop_computer: Using the **Middle Tier**

By the end of this is, _my goal_ is to get you comfortable enough to start solving the real business problems on your own.

## :heart_eyes_cat: Starting a **new project** from scratch

1. Visit the [URL](https://dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template)
2. Click the Vertical Elipsis on the page to bring up the `Fork` option.
   ![Fork Option](./fork_option.png)
3. After forking the template, clone it from your project.

_Below shows an example for the **LEADS** repository in the **Parole LEADS** project_

```sh
git clone https://cdcr@dev.azure.com/cdcr/Parole%20LEADS/_git/LEADS
cd LEADS
npm install # install any package.json dependencies
npm run start-servers # Start the local mt backend with the start-servers script in package.json
npm run serve # Start the local frontend webserver with the serve script in package.json
```

## :name_badge: Adding the **project name** to the app

- [ ] Change your `name` in `package.json`

Check out the [Config section](/config/#name) to learn more

- By default the `name` as it's shown in your application is derived from `package.json`
- `package.json` has a boundary requiring the `name` to pass the following [regex](https://regex101.com/r/hFKllG/1):

```
^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$
```

- [ ] Change **vue-frontend-template** in `README.md` to your project name.
- **Usage:**

```javascript
// Access it in a `.vue` file with `this.$myApp` or import in another `.js` file
import myApp from '@/config/myApp.js';
console.log('myApp: ', myApp.name);
```

## :rainbow: Adding **color** to the app

Light and Dark themes are derived from the file `"@/plugins/themes.js"`

- [ ] Change the `primary,secondary,accent,error,info,success and warning` colors as needed.

- If you want to change the bar colors, you can do so in: _(Just remember to check font colors too)_
  - `@/components/layouts/navigation/AppBar.vue`
  - `@/components/layouts/navigation/BottomNavBar.vue`
  - `@/components/layouts/navigation/NavDrawerLeft.vue`
  - `@/components/layouts/navigation/NavDrawerRight.vue`

:::details
<<< @/../src/plugins/themes.js
:::

NOTE: _Remember to see what it also looks like in dark mode before settling on a theme._

## :black_flag: Adding the application **logo**

- [ ] _If you have one_, add your logo to the app with the following script:

```sh
# This script takes in a single argument pointing to your .svg or .png file.
# A backup of your old public/img/icons folder is created.
# The final product is an updated public/img/icons folder with all the appropriate sizes for PWA.
./scripts/image_resize.sh ~/Documents/Icons/logo.png
```

You should see a logo change after a refresh now.

![New Logo](./new_logo.png)

## :stop_sign: Pausing to **push and commit** your changes

### Naming our working branch

When first starting off the `main` branch is checked out.
It's good practice to work in our own branch and not pollute `main`.

```sh
git checkout -b MyWorkingBranch
```

### Stage - Commit - Push

Now is a good time to `stage` all of our changes, give it a good `commit` message and `push` them to devops.

- [ ] Run the following in a terminal:

```sh
git add . # Stage your changes
git commit -m "Updated application name, applied application themes, and added logo." # Give it a good commit message
git push # Push
```

We're ready to move on to the next steps! :checkered_flag:

## :oncoming_taxi: Using **Vue Router**

Vue Router is used for our navigation throughout the app. It can even handle an array of `children` within its [`RouterConfig`](/routing/#routeconfig-interface)!

### Create the component for your route

- [ ] Create a new `MyComponent.vue` file in `@/views/...`

```vue
<template>
  <v-list>
    <v-list-item
      ><v-list-item-action @click="sayHello()"
        ><v-icon>mdi-message-outline</v-icon></v-list-item-action
      >
      <v-list-item-content>{{ text }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
  export default {
    name: 'MyComponent',
    data: () => ({
      text: 'My List Item',
    }),
    computed: {
      loading() {
        return this.$store.state.app.loading;
      },
    },
    methods: {
      sayHello() {
        this.$store.commit('app/SET_LOADING', true);

        setTimeout(() => {
          alert('Hello world!');
          this.$store.commit('app/SET_LOADING', false);
        }, 300);
      },
    },
  };
</script>
```

### Configure a route for your component

:::tip
It is recommened we lazy load our components with the `import(/*webpackChunkName: "..." */ '...')` statement.
:::
[Webpack](https://webpack.js.org/api/module-methods/#magic-comments)

- [ ] Navigate to `@/router/routes.js`
- [ ] Add your [`RouteConfig`](/routing/#routeconfig-interface) to the `routes` array.

```js
// "@/router/routes.js

const routes = [
  ...

  {
    name: 'My New Route',
    path: '/mynewroute',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/MyComponent.vue'),
  },

  ...
];
```

- [ ] Add your route to the Routed Items at the bottom for navigation.
      The default choices are shown below:

_Feel free to add your own `Items`, just remember to apply it to the `NavDrawerLeft.vue` component._
Read more on that at [routing/#routeconfig-interface](/routing/#navigation)

```js
// Public Routes
const anonymousItems = getRoutesByName(['Login', 'Settings']);
// Routes for Anyone Logged In
const userItems = getRoutesByName(['Home', 'My New Route']);
// Routes for Users with Role Admin
const adminItems = getRoutesByName(['Admin']);
// Routes used for the Toolbar in AppBar.vue
const userToolbarItems = getRoutesByName([
  'Home',
  'Logout',
  'Settings',
  'CDCR Dashboard',
]);
```

Navigate to your new page using the left navigation drawer!

![My New Route Page](./mynewroute_page.png)

## :ledger: Using **Vuex** for state management

`Vuex` is used for state management of our applications. This greatly reduces the need to pass `props` or `$emit` events that the parent/child listens for. `vuex-pathify` **greatly** reduces the boilerplate code around creating mutations.

### Helper vuex-pathify to access state

Update our `MyComponent.vue` file to utilize `vuex-pathify` instead.

```vue
<template>
  <v-list>
    <v-list-item
      ><v-list-item-action @click="sayHello()"
        ><v-icon>mdi-message-outline</v-icon></v-list-item-action
      >
      <v-list-item-content>{{ text }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
  import { sync } from 'vuex-pathify';
  export default {
    name: 'MyComponent',
    data: () => ({
      text: 'My List Item',
    }),
    computed: {
      ...sync('app', ['loading']),
    },
    methods: {
      sayHello() {
        this.loading = true;

        setTimeout(() => {
          alert('Hello world!');
          this.loading = false;
        }, 300);
      },
    },
  };
</script>
```

Much less code to track! :nerd_face:

### Creating a Vuex Module

- [ ] Copy `@/store/modules/example.js` and rename to `greetings.js` to create your first vuex module.

_@/store/modules/example.js_

<<< @/../src/store/modules/example.js

- [ ] Update the `getDefaultState` in `greetings.js` to be the following:

```js
const getDefaultState = () => {
  return {
    text: '',
  };
};
```

### Using your Vuex Module

In the component we created earlier, we can now pull in the greetings and update it with `vuex-pathify`!

Update your component to sync our state `text` from the `greetings` module.

```vue
<template>
  <v-list>
    <v-list-item
      ><v-list-item-action @click="sayHello()"
        ><v-icon>mdi-message-outline</v-icon></v-list-item-action
      >
      <v-list-item-content>{{ text }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
  import { sync } from 'vuex-pathify';
  export default {
    name: 'MyComponent',
    data: () => ({}),
    computed: {
      ...sync('app', ['loading']),
      ...sync('greetings', ['text']),
    },
    methods: {
      sayHello() {
        this.loading = true;

        setTimeout(() => {
          this.text = 'Hello World!';
          this.loading = false;
        }, 300);
      },
    },
  };
</script>
```

### Persist your Vuex Module

- [ ] Add your `vuex module name` to the `modules` array in any of these files:
- `@/store/plugins/cookies.js`
- `@/store/plugins/indexedDB.js`
- `@/store/plugins/localStorage.js`\
  NOTE: _Only `indexedDB` is automatically encrypted by compression during production!_

```js
// @/store/plugins/indexedDB.js
const modules = ['users', 'greetings']; // TODO: Add any modules you want to save to persistence
```

Now when you refresh your page, your `text` does not go away.

## :desktop_computer: Using the Middle Tier

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

### Accessing your Services

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

### Giving your application API permissions

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

### Updating your application template

Add a remote called `upstream` that points to the forked repository.
You can then pull down the latest changes from the template like so.

```sh
git remote -v # Check that you don't already have it
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
git fetch upstream main
git merge --squash upstream/main
```

## :question: FAQ

### When to Fork vs Clone?

- **Fork** - when you're creating a project in devops for the first time.

- **Clone** - when you're pulling down the project you just forked in devops to your local machine.
  - Because a `git clone` does not bring down any upstream branches, git will tell you to run the command below:

```
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
```

### What's the difference between a git `clone` and `fork`.

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

### How to update template version?

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

#### Tips:

- Use `git fetch upstream main` to check for updates.
- Select the **Accept all incoming.** option when dealing with merge conflicts in `@/config/private/`.
- All other merge conflicts should be handled normally.

### How to update app version?

You can properly update your application `major`, `minor`, and `patch` releases with **npm** provided commands.

- This bumps up the version appropriate
- Creates a commit on your current branch with the version number
- Creates a tag _(Not needed)_

* **Type:** `CLI`
* **Usage:**

```sh
# Assume we're currently on version 1.0.1

npm version major # Sets the version to v2.0.0
npm version minor # Sets the version to v1.1.0
npm version major # Sets the version to v1.0.2
```

### Why am I getting errors from `api/auth/v1/authentication`

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

### Why does the app name in the browser title show up with delimitters?

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

### How can I access my Vue app through console?

By default the Vue application is mounted to an element with the id app.

- [ ] Open DevTools with `Ctrl + Shift + I`
      In the prompt you can create a variable and assign it to app.

```javascript
const app = document.getElementById('app').__vue__;
app.$store.set('app/loading', true);
app.$store.set('app/loading', false);
```

:::tip
You actually have access to the store already in the dev tools.
:::

```js
store.set('app/loading', true);
store.set('app/loading', false);
```
