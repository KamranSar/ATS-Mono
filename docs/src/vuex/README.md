---
sidebar: auto
---

# Vuex

Vuex is an essential part of the **vue-frontend-template**, it is the most important state management system we have.

## Vuex Module

### Example Module

```js
import { make } from 'vuex-pathify';
const getDefaultState = () => {
  return {
    exampleData: { foo: 1, bar: 2, biz: 3, baz: 4 },
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

### Example Feathers Module

This example module wraps around a Feathers service

```js
import service from '@/feathers/services/example/example.service.js';

import { make } from 'vuex-pathify';
const getDefaultState = () => {
  return {
    exampleData: { foo: 1, bar: 2, biz: 3, baz: 4 },
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
  find: async ({ commit, state }, params) => {
    const response = await service.find(params);
    response.data.forEach((data) => {
      commit.set(state.exampleData[data._id], response);
    });
  },
  get: async ({ commit, state }, id, params) => {
    const response = await service.get(id, params);
    commit.set(state.exampleData[response._id], response);
  },
  create: async ({ commit, state }, data, params) => {
    // TODO: return on response could be an object or an array
    const response = await service.create(data, params);
    commit.set(state.exampleData[response._id], response);
  },
  update: async ({ commit, state }, id, data, params) => {
    // TODO: return on response could be an object or an array
    const response = await service.update(id, data, params);
    commit.set(state.exampleData[id], response);
  },
  patch: async ({ commit, state }, id, data, params) => {
    // TODO: return on user could be an object or an array
    const response = await service.patch(id, data, params);
    commit.set(state.exampleData[id], response);
  },
  remove: async ({ commit, state }, id, params) => {
    await service.remove(id, params);
    delete state.exampleData[id];
    commit.set(state.exampleData, state.exampleData);
  },

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

## Module Registration

:::tip
Vuex modules are automatically using their filename as the namespace.
:::

Module registration is handled by the file `@/store/modules/index.js`. When a module gets registered by vuex, the filename is used as the namespace for that module.
This same method is used for plugins!

:::tip
It is also possible to move it into its own folder
:::

- [ ] Create a new folder called the name of your module
- [ ] Move the module file and rename it to `index.js`

## Plugins

There are two plugins that are used in tandem with vuex, and they are called `vuex-pathify` and `vuex-persist`.

### vuex-pathify

- **With:**\
  This plugin is used to provide easy access to our store state.
  It gives us access to store helpers such as:

```js
// Example 1 With:
this.$store.set('/app/loading', true);
this.$store.set('/app/loading', false);
this.$store.get('/users/loggedInUser');

/* OR */

// Example 2 With:
import { sync, get } from 'vuex-pathify';
computed: {
  ...sync('app', ['loading']),
  ...get("users", ['loggedInUser'])
},
```

- **Without it:**\
  Mutating our state is cumbersome... we'll have to define `mutations` for every state.

```js
// Example 1 Without:
this.$store.commit('app/SET_LOADING', true);
this.$store.commit('app/SET_LOADING', false);
this.$store.commit('app/SET_LOGGED_IN_USER', { ... });
```

And it would also make accessing our states cumbersome too!

```js
// Example 2 With:
computed: {
  loading: {
    get: () => {
      return this.$store.state.app.loading;
    },
    set: (value) => {
      this.$store.commit('app/SET_LOADING', value);
    }
  },
  loggedInUser() => {
    return this.$store.state.users.loggedInUser
  }
}
```

### vuex-persist

:::tip
:lock: indexedDB is encrypted out of the box in production!
:::

:::danger
:eyes: cookies, sessionStorage and localStorage are not encrypted!
:::

The `vuex-persist` plugin is used to persist our selected vuex modules into the chosen storage medium.
The options available are:

- indexedDB
- cookies
- sessionStorage
- localStorage

Within any of the files `indexedDB.js`, `cookies.js`, `sessionStorage.js`, or `localStorage.js`, found in `@/store/plugins/`, is an array called `modules`.
Simply adding the **vuex module name** to the array is all we need to do to persist it.

## Persistence

```js
// @/store/plugins/indexedDB.js
const modules = ['users']; // TODO: Add any modules you want to save to persistence
```

### indexedDB

Expand the details to the plugin for persisting to indexedDB with encryption.

::: details
<<< @/../src/store/plugins/indexedDB.js{10}
:::

### cookies

Expand the details to the plugin for persisting to cookies.

::: details
<<< @/../src/store/plugins/cookies.js{8}
:::

### sessionStorage

Expand the details to the plugin for persisting to sessionStorage.

::: details
<<< @/../src/store/plugins/sessionStorage.js{5}
:::

### localStorage

Expand the details to the plugin for persisting to localStorage.

::: details
<<< @/../src/store/plugins/localStorage.js{6}
:::

## Restoring a Vuex Module

All vuex modules are restored before a user enters a route via the `beforeEnter` hook using the `waitForStorageToBeReady` guard.

"Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered pending before all hooks have been resolved." - Source: [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards)

## Resources

[vuex](https://vuex.vuejs.org/guide/#the-simplest-store)

[vuex-pathify](https://davestewart.github.io/vuex-pathify/#/?id=home)

[vuex-persist](https://championswimmer.in/vuex-persist/)

[Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards)

[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

[Cookies](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies)

[Session Storage](developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

[Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

[waitForStorageToBeReady](/routing/#waitForStorageToBeReady)
