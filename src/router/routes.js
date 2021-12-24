/**
 * This file contains all the routes used by vue-router and the navigation components
 */

import checkForChildren from '@/router/helpers/checkForChildren.js';
import defaultRoutes from '@/config/private/router/routes.js'; // [Home, Login Logout, Sign Out, Users, 4oh4]
import Account from '@/views/Settings/Account.vue';
import UserPreferences from '@/views/Settings/UserPreferences.vue';
/* eslint-disable */
import hasAnyRoles from '@/router/guards/hasAnyRoles.js';
// import hasAllRoles from '@/router/guards/hasAllRoles.js';
/* eslint-enable */
import { defaultAdminRole } from '@/config/myApp.js';

const routes = [
  ...defaultRoutes,
  {
    icon: 'mdi-bus-multiple',
    path: '/transfer',
    name: 'Transfer',
    component: () =>
      import(/* webpackChunkName: "Transfer" */ '@/views/Transfer.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Guest',
      ],
    },
  },
  {
    icon: 'mdi-bus-clock',
    path: '/schedule',
    name: 'Schedule',
    component: () =>
      import(/* webpackChunkName: "Schedule" */ '@/views/Schedule.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Guest',
      ],
    },
  },
  {
    icon: 'mdi-cog-outline',
    path: '/maintenance',
    name: 'Maintenance',
    component: () =>
      import(/* webpackChunkName: "Maintenance" */ '@/views/Maintenance.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Guest',
      ],
    },
  },
  {
    icon: 'mdi-file-document',
    path: '/reports',
    name: 'Reports',
    component: () =>
      import(/* webpackChunkName: "Reports" */ '@/views/Reports.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Guest',
      ],
    },
  },
  {
    icon: 'mdi-account-key-outline',
    name: 'Admin',
    path: '/admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/Admin/Admin.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [defaultAdminRole.name],
    },
    children: [
      {
        // ! DO NOT REMOVE REQUIRED ROUTE --> "/users"
        icon: 'mdi-account-multiple-outline',
        path: 'users',
        name: 'Users',
        component: () =>
          import(/* webpackChunkName: "users" */ '@/views/Admin/Users.vue'),
        // meta: {
        //   beforeResolve: (to, from, next) => hasAllRoles(to, from, next),
        //   hasAllRoles: [defaultAdminRole.name, 'asdfasdfasdf'],
        // },
      },
    ],
  },
  {
    icon: 'mdi-cog-outline',
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(
        /* webpackChunkName: "settings" */ '@/views/Settings/Settings.vue'
      ),
    children: [
      {
        name: 'Account',
        path: 'account',
        icon: 'mdi-account-outline',
        component: Account,
      },
      {
        name: 'Preferences',
        path: 'user-preferences',
        icon: 'mdi-cog-outline',
        component: UserPreferences,
        // meta: {
        //   beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
        //   hasAnyRoles: ['System Administrator'],
        // },
      },
    ],
  },
];

// #region getRoutesByName
/**
 * @name getRoutesByName
 * Filter for routes only in the list.
 *
 * @example
 * getRoutesByName('Home')
 * getRoutesByName('home')
 * getRoutesByName(['Home', 'Users'])
 * getRoutesByName(['Home', 'Users', { name: 'Settings', parentOnly: true }])
 * getRoutesByName({ name: 'Settings', parentOnly: true })
 *
 * @param {*} listOfRouteNames - An Array of route names. A single string with the route name. An array of objects or a single object `{name: String, parentOnly: Boolean}`.
 * @returns {Array[RouteConfig]} An Array of Type Vue Router
 */
function getRoutesByName(listOfRouteNames) {
  if (
    typeof listOfRouteNames === 'string' ||
    (listOfRouteNames.name && 'parentOnly' in listOfRouteNames)
  ) {
    listOfRouteNames = [listOfRouteNames];
  }

  if (
    listOfRouteNames &&
    Array.isArray(listOfRouteNames) &&
    listOfRouteNames.length &&
    routes &&
    routes.length
  ) {
    const reducer = (currentValue) =>
      currentValue.name
        ? { ...currentValue, name: String(currentValue.name).toLowerCase() }
        : String(currentValue).toLowerCase();
    listOfRouteNames = listOfRouteNames.map(reducer);
    routes.forEach((route) => {
      const routeName = String(route.name).toLowerCase();
      const idx = listOfRouteNames.findIndex(
        (r) => r.name === routeName || r === routeName
      );
      if (idx !== -1) {
        if (listOfRouteNames[idx].parentOnly) {
          listOfRouteNames[idx] = { ...route, children: [] }; // Spread router contents and prepopulate children with empty array to safely delete later.
          delete listOfRouteNames[idx].children;
        } else {
          listOfRouteNames[idx] = route;
        }
      }
      checkForChildren(route, listOfRouteNames);
    });
  }
  // console.log('listOfRouteNames: ', listOfRouteNames);
  return listOfRouteNames.filter((route) => typeof route === 'object');
}
// #endregion getRoutesByName

// Routes used in AppBar.vue
const TopNavItems = getRoutesByName([
  // 'Home',
  // 'Settings',
  // 'Admin',
  // 'CDCR Dashboard',
  // 'Settings',
  // 'Login',
  // 'Logout',
]);
// Routes used in the v-toolbar in AppBar.vue
const ToolbarItems = getRoutesByName([
  'Home',
  'Login',
  'Logout',
  { name: 'Settings', parentOnly: true },
  'CDCR Dashboard',
]);
// Routes used in BottomNavBar.vue
const BottomNavItems = getRoutesByName(['Home', 'Admin', 'Login', 'Logout']);
// Routes used in NavDrawerLeft.vue
const LeftNavItems = getRoutesByName([
  'Home',
  'Schedule',
  'Transfer',
  'Maintenance',
  'Reports',
  'Admin',
  { name: 'Settings', parentOnly: true },
  'Login',
  'Settings',
  'Logout',
]);

export {
  getRoutesByName,
  TopNavItems,
  ToolbarItems,
  BottomNavItems,
  LeftNavItems,
};
export default routes;
