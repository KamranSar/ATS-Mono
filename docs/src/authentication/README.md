---
sidebar: auto
---

# Authentication

There are **2** places in the application that authentication kicks off, when the Vue application is initialized and before entering each route.

1. Vue - `main.js`
2. Vue Router - `@/router/index.js`

Vuex is used to coordinate the efforts of passing data and later on persisting it.

## Auth Helpers

### logout

:::tip
The difference between this and `/signout` is that `/signout` requires a disclaimer to the users since it also logs them out of Teams, Outlook, DevOps, etc.
:::

The `logout` helper is provided as a method and not a route to avoid accidentally routing to `/logout` and logging out as a consequence.

- **Type:** `Function`
- **Location:** `@/config/private/helpers/logout.js`
- **Usage:**

```html
<template>
  <v-btn @click="logout()">Logout</v-btn>
</template>

<script>
  import logout from '@/config/private/helpers/logout.js';
  export default {
    methods: { logout },
  };
</script>
```

::: details
<<< @/../src/config/private/helpers/logout.js
:::

### /signout

This route hooks into a private helper called `signOut` found in the `azure` module.
The private helper _can_ be used but the route provides a better user experience.

- When visiting this route, a dialog will popup with a warning that they are about to **Sign out of Microsoft**. _(Teams, Outlook, Devops...)_

  - If the dialog is discarded, nothing happens and they stay on a route called `/signout` which has a button they can click to bring the dialog back up.

- **Type:** `Route`
- **Location:** `@/config/private/helpers/signout.js`
- **Usage:**

```html
<router-link to="/signout" exact>Log in as another user</router-link>
```

::: details
<<< @/../src/config/private/helpers/signout.js
:::

### getNewToken

:::tip
This private helper can be called any time throughout the application but is already done for you and not necessary.
:::

This helper makes the required authentication calls to both azure and our middle tier.

- This private helper gets called on a setInterval we've created on `main.js`.
- This is also called during a refresh of all our vuex modules in before the creation of each route with the guard `waitForStorageToBeReady`.

- **Type:** `Function`
- **Location:** `@/config/private/helpers/getNewToken.js`
- **Usage:**

```js
import getNewToken from '@/config/private/helpers/getNewToken.js';

export default {
  async mounted() {
    await getNewToken();
  },
};
```

::: details
<<< @/../src/config/private/helpers/getNewToken.js
:::

### AzureAuthentication

:::warning
Do not call this store action, this is called once in the `SignInWithMicrosoftButton.vue`
:::

This action is responsible for making the appropriate calls to authentication with Azure and stores the token response to then fetch other meta data such as profile and photo.

- `AzureAuthentication` is a store action defined in `@/config/private/store/modules/azure/index.js`

- **Type:** `Vuex Action`
- **Location:** `@/config/private/store/modules/azure/index.js`

:::details
<<< @/../src/config/private/store/modules/azure/index.js#AzureAuthentication
:::

### getMidTierToken

:::warning
Do not call this private helper, this is already called for you under `getNewToken`
:::

This private helper is called under `getNewToken` and utilizes the token created by **azure** to pass into our middle tier.

- **Type:** `Function`
- **Location:** `@/config/private/helpers/getMidTierToken.js`

::: details
<<< @/../src/config/private/helpers/getMidTierToken.js
:::

### feathersTokenExpiration

:::warning
Do not call this private helper, this is already called for you under `getNewToken`
:::

Returns true or false depending on whether our Feathers token has expired.

- Type: `Function`
- Return: `Boolean`

::: details
<<< @/../src/config/private/helpers/feathersTokenExpiration.js
:::

## Javascript Helpers

### roleCheck

A globally available helper to do a role check, the default type passed in (second parameter) is `hasAllRoles`

- **Type:** `Function`
- **Param:** `Array[String]`
- **Location:** `@/helpers/roleCheck.js`
- **Usage:**

```html
<v-btn v-if="roleCheck(roles, 'hasAnyRoles')" class="ma-1" color="info">
  Has all the roles required.
</v-btn>
<v-btn v-else class="ma-1" color="error">
  Does not the meet role requirements.
</v-btn>
```

```js
// Some .vue file
export default {
  beforeRouteEnter(to, from, next) {
    if (this.$hasAllRoles(['Required Role 1', 'Required Role 2'])) {
      next();
    } else {
      next({ name: 'No Access' });
    }
  },
};
```

::: details
<<< @/../src/helpers/roleCheck.js
:::
