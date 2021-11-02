---
sidebar: auto
---

# Routing

:::tip
I **highly** encourage you to check out the resource [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) in the VueRouter docs.
:::

All routes are handled by [Vue Router](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields)

The **vue-frontend-template** has pre-configured all the routes defined in `@/router/routes.js` to work with the Navigation Components we have in `@/components/layouts/navigation...`

_These can be easily expanded by defining your own [route items](/routing/#route-items)!_

## RouteConfig Interface

**All routes are defined in the file `@/router/routes.js`**

Within the `routes.js` file is an array called `routes`. Each route object should follow [the defined interface](https://router.vuejs.org/api/#routes):

```javascript
interface RouteConfig = {
  path: string,
  component?: Component,
  name?: string, // for named routes
  components?: { [name: string]: Component }, // for named views
  redirect?: string | Location | Function,
  props?: boolean | Object | Function,
  alias?: string | Array<string>,
  children?: Array<RouteConfig>, // for nested routes
  beforeEnter?: (to: Route, from: Route, next: Function) => void,
  meta?: any,
  caseSensitive?: boolean, // use case sensitive match? (default: false)
  pathToRegexpOptions?: Object // path-to-regexp options for compiling regex

  /* vue-fronted-template specific fields */
  icon: 'mdi-home',
  onClick: () => alert('Roll for initiative!'), // Set path to '' for onClick to fire.
}
```

### Example Route

```js
// No Access route for users with no roles
{
  path: '/noaccess',
  name: 'No Access',
  component: () =>
    import(/* webpackChunkName: "NoAccess" */ '@/views/NoAccess.vue'),
}
```

### Full Example Route

```js
const routes = [
  ...defaultRoutes,
  {
    icon: 'mdi-account-key-outline',
    name: 'Admin',
    path: '/admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/Admin/Admin.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [defaultAdminRole.name, 'Institution Administrator'],
    },
    children: [
      {
        // ! DO NOT REMOVE REQUIRED ROUTE --> "/users"
        icon: 'mdi-account-multiple-outline',
        path: 'users',
        name: 'Users',
        component: () =>
          import(/* webpackChunkName: "users" */ '@/views/Admin/Users.vue'),
        meta: {
          beforeResolve: (to, from, next) => hasAllRoles(to, from, next),
          hasAllRoles: [defaultAdminRole.name, 'Foo Bar'],
        },
      },
    ],
  },
];
```

## Navigation

The template uses the components `AppBar.vue`, `NavDrawerLeft.vue` and `BottomNavBar.vue` for displaying the route items defined in `@/router/routes.js`
_(These components are defined in `@/components/layouts/navigation/`)_

### Route Items

The navigation components utilize the route items defined below, but feel free to expand upon these and add them to any of the navigation component for display.

```js
// Routes used in AppBar.vue
const TopNavItems = getRoutesByName([
  // 'Home',
  // 'Settings',
  // 'Admin',
  // 'CDCR Dashboard',
  // 'Settings',
]);
// Routes used in the v-toolbar in AppBar.vue
const ToolbarItems = getRoutesByName([
  'Home',
  'Logout',
  'Settings',
  'CDCR Dashboard',
]);
// Routes used in BottomNavBar.vue
const BottomNavItems = getRoutesByName(['Home', 'Admin']);
// Routes used in NavDrawerLeft.vue
const LeftNavItems = getRoutesByName(['Home', 'Admin', 'Settings']);
```

### getRoutesByName

The helper used above can also be found in `@/router/routes.js`

- **Type:** `Function`
- **Param:** `String | Array[String]` A single router name, or an array of router names
- **Returns:** `Array[Object]` Returns an array of all of our router items or an empty set.
- **Location:** `@/router/routes.js`
- **Usage:**

```js
import { getRoutesByName } from '@/router/routes.js';

const homeRoute = getRoutesByName('Home');
console.log({ homeRoute });
const homeRoute2 = getRoutesByName('home');
console.log({ homeRoute });
const homeAndUsers = getRoutesByName(['Home', 'Users']);
console.log({ homeAndUsers });
```

:::details
<<< @/../src/router/routes.js#getRoutesByName

### checkForChildren

:::warning
Do not use this helper, this helper is used by getRoutesByName
:::

This helper is used by getRoutesByName to recursively check all children within a route.

- **Type:** `Function`
- **Param 1:** `RouteConfig`
- **Param 2:** `Array[String]`
- **Location:** `@/router/helpers/checkForChildren.js`

::: details
<<< @/../src/router/helpers/checkForChildren.js
:::

## Secure your routes

The application by default sends a user to the **No Access** route if they have no roles assigned in the app.\
**This is handled with the helper hasARole**

This and more can all be added to your own use cases with the pre-defined `router-guards`, `vue-directives`, and `javascript helpers`.

## Global Guards

### beforeEach

:::warning
This hook is currently populated with the Router Guard [waitForStorageToBeReady](/routing/#waitforstoragetobeready) in the vue-frontend-template.
:::

Global action before entering any route (_`this`_ is out of scope)

- **Usage:**

```js
const router = new VueRouter({ ... })

router.beforeEach(waitForStorageToBeReady);

```

### beforeResolve

:::tip
This is actually how the router guards `hasAnyRoles`, & `hasAllRoles` are consumed when found in the **meta** field of a route.
:::

"You can register a global guard with `router.beforeResolve`. This is similar to `router.beforeEach`, with the difference that resolve guards will be called right before the navigation is confirmed, **after all in-component guards and async route components are resolved.**" - [Vue Router Docs](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-resolve-guards)

### afterEach

Action after the route resolves (**you cannot affect the navigation**).

- **Usage:**

```js
router.afterEach((to, from) => {
  // ...
});
```

## Per-Route Guard

### beforeEnter

Action before entering a specific route (unlike global guards, we have access to _`this`_).

- **Usage:**

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      },
    },
  ],
});
```

## Component Guards

### beforeRouteEnter

Action before navigation is confirmed, and before component creation (no access to _`this`_)

- **Usage:**

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component instance via `vm`
  })
}
```

### beforeRouteUpdate

Action after a new route has been called that uses the same component

- **Usage:**

```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

### beforeRouteLeave

"The **leave guard** is usually used to prevent the user from accidentally leaving the route with unsaved edits. The navigation can be canceled by calling `next(false)`." - [Vue Router Docs](https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards)

- **Usage:**

```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

## Router Guards

:::warning
When using the router guards, remember to define the `hasAnyRoles` or `hasAllRoles` Array in the Route Config.
:::

Two guards are provided to us called `hasAnyRoles` & `hasAllRoles`. These guards can be found in `@/router/guards/`

### hasAnyRoles

This router guard checks if any of the roles passed into the route are found in the `loggedInUser`.

- **Type:** `beforeResolve Guard`
- **Location:** `@/router/guards/hasAnyRoles.js`
- **Usage:**\
  Add this to the `beforeResolve` hook in the `meta` of a `Route Config`, and define an Array of role names called `hasAnyRoles`.

```js
import hasAnyRoles from '@/router/guards/hasAnyRoles.js';
const routes = [
  {
    icon: 'mdi-home',
    path: 'Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [defaultAdminRole.name, 'Foo Bar'],
    },
  },
];
```

:::details
<<< @/../src/router/guards/hasAnyRoles.js
:::

### hasAllRoles

This router guard checks for all of the roles passed into the route against the `loggedInUser`.

- **Type:** `beforeResolve Guard`
- **Location:** `@/router/guards/hasAllRoles.js`
- **Usage:**\
  Add this to the `beforeResolve` hook in a `route` object, and define an Array of role names called `hasAllRoles`.

```js
import hasAllRoles from '@/router/guards/hasAllRoles.js';
const routes = [
  {
    icon: 'mdi-home',
    path: 'Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAllRoles(to, from, next),
      hasAllRoles: [defaultAdminRole.name, 'Foo Bar'],
    },
  },
];
```

:::details
<<< @/../src/router/guards/hasAllRoles.js
:::

### waitForStorageToBeReady

:::tip
Because this is called on refresh, we also renew their token and check for roles before continuing :thumbsup:!
:::

- This waits for all of our vuex modules to be restored before we can enter the creation state of our routes.

"Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered pending before all hooks have been resolved." - Source: [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards)

- Calls [`getNewToken`](authentication/#getnewtoken) to renew the users token if they have one.
-
- **Type:** `beforeEach Guard`
- **Location:** `@/router/guards/waitForStorageToBeReady.js`
- **Usage:**\
  This is already added to the `beforeEach` hook in our router.

```js
import waitForStorageToBeReady from '@/router/guards/waitForStorageToBeReady.js';

router.beforeEach(waitForStorageToBeReady);
```

:::details
<<< @/../src/router/guards/waitForStorageToBeReady.js
:::

## Javascript Helpers

### hasARole

:::tip
Remember to call it as a **function** or it will not work as expected!
:::

<center><span style="color: green; font-weight: bold;">RIGHT</span></center>

```html
<v-btn :disabled="$hasARole()">Search</v-btn>
```

<center><span style="color: red; font-weight: bold;">WRONG</span></center>

```html
<v-btn :disabled="$hasARole">Search</v-btn>
```

This is a global helper to check if the `loggedInUser` has been assigned any roles.

- **Type:** `Global Helper`
- **Return:** `Boolean`
- **Location:** `@/helpers/hasARole.js`
- **Usage:**\
  Add this to the attribute `disabled` or a `v-if` directive to determine the behavior of a button or text-field.

```html
<v-btn :disabled="$hasARole()">Search</v-btn>

<v-btn v-if="$hasARole()">Submit Request</v-btn>
<v-btn v-else>Request Permissions</v-btn>
```

:::details
<<< @/../src/helpers/hasARole.js
:::

### hasAnyRoles

This is the global helper equivalent of the router guard `hasAnyRoles`.

- **Type:** `Global Helper`
- **Param:** `Array[String]`
- **Return:** `Boolean`
- **Location:** `@/helpers/hasAnyRoles.js`
- **Usage:**\
  Add this to the attribute `disabled` or a `v-if` directive to determine the behavior of a button or text-field.

```html
<!-- NOT Disabled if user has any of these roles -->
<v-btn :disabled="!$hasAnyRoles([defaultAdminRole.name, 'Application User'])"
  >Search</v-btn
>

<v-btn v-if="$hasAnyRoles([defaultAdminRole.name])">Approve Request</v-btn>
<v-btn v-else-if="$hasAnyRoles(['Application User'])">Submit Request</v-btn>
<v-btn v-else>Request Permissions</v-btn>
```

:::tip
If your `beforeResolve` route is more complex than what comes out of the box, you an utilize the global helpers to determine what happens `next()`.
:::

```js
import hasARole from '@/helpers/hasARole.js';
import hasAnyRoles from '@/helpers/hasAnyRoles.js';
import { defaultAdminRole } from '@/config/myApp.js';

const routes = [
  {
    icon: 'mdi-home',
    path: 'Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      beforeResolve: (to, from, next) => {
        if (!hasARole()) {
          next({ name: 'No Access' });
        } else if (hasAnyRoles(['Guest User'])) {
          next({ name: 'Guest Home' });
        } else if (hasAnyRoles([defaultAdminRole.name])) {
          next();
        } else {
          next({ name: '4oh4' });
        }
      },
    },
  },
];
```

:::details
<<< @/../src/helpers/hasAnyRoles.js
:::

### hasAllRoles

This is the global helper equivalent of the router guard `hasAllRoles`

- **Type:** `Global Helper`
- **Location:** `@/helpers/hasAllRoles.js`
- **Usage:**\
  Add this to the `beforeResolve` hook in a `route` object, and define an Array of role names called `roles`.

```js
import hasAllRoles from '@/router/guards/hasAllRoles.js';
const routes = [
  {
    icon: 'mdi-home',
    path: 'Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAllRoles(to, from, next),
      hasAllRoles: [defaultAdminRole.name, 'Foo Bar'],
    },
  },
];
```

:::details
<<< @/../src/helpers/hasAllRoles.js
:::

### checkRouteItems

This helper takes in an array of routes to loop through and an optional second parameter called `hasRoles`, which defaults to `false`.
The purpose of this helper is to do a role check for all the routes and not a single parent/child.

- Calls [`hasRoles`](authentication/#hasRoles) under the hood.
- **Type:** `Function`
- **Location:** `@/router/helpers/checkRouteItems.js`
- **Usage:**\
  This is already called in the router guards and their v-directive equivalents `hasAnyRoles` and `hasAllRoles`.

:::details
<<< @/../src/router/helpers/checkRouteItems.js
:::

## vue-directives

The globally registered directives that are available are called `v-has-any-roles` and `v-has-all-roles`.

### v-has-any-roles

A globally available helper to check if the user has any of the roles passed in.

- **Type:** `directive`
- **Param:** `Array[String]`
- **Location:** `@/directives/v-has-any-roles/index.js`
- **Usage:**

```html
<v-btn
  v-has-any-roles="['Role 1', 'Optional Role 2']"
  class="ma-1"
  color="info"
>
  Has a role required.
</v-btn>
```

::: details
<<< @/../src/directives/v-has-any-roles/index.js
:::

### v-has-all-roles

A globally available helper to check if the user has all of the roles passed in.

- **Type:** `directive`
- **Param:** `Array[String]`
- **Location:** `@/directives/v-has-all-roles/index.js`
- **Usage:**

```html
<v-btn
  v-has-all-roles="['Required Role 1', 'Required Role 2']"
  class="ma-1"
  color="info"
>
  Has all the roles required.
</v-btn>
```

::: details
<<< @/../src/directives/v-has-all-roles/index.js
:::

## Full Navigation Resolution Flow

::: tip
This is verbatim from [Vue Router Docs](https://router.vuejs.org/guide/advanced/navigation-guards.html#the-full-navigation-resolution-flow)
:::

1. Navigation triggered.
2. Call `beforeRouteLeave` guards in deactivated components.
3. Call global `beforeEach` guards.
4. Call `beforeRouteUpdate` guards in reused components.
5. Call `beforeEnter` in route configs.
6. Resolve async route components.
7. Call `beforeRouteEnter` in activated components.
8. Call global `beforeResolve` guards.
9. Navigation confirmed.
10. Call global `afterEach` hooks.
11. DOM updates triggered.
12. Call callbacks passed to `next` in `beforeRouteEnter` guards with instantiated instances.

## Resources

[Vue Router](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields)

[Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)

[Route Config Interface](https://router.vuejs.org/api/#routes)
