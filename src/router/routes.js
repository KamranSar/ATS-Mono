/**
 * This file contains all the routes used by vue-router and the navigation components
 */

import checkForChildren from '@/router/helpers/checkForChildren.js';
import defaultRoutes from '@/config/private/router/routes.js'; // [Home, Login Logout, Sign Out, Users, 4oh4]
// eslint-disable-next-line
import hasAnyRoles from '@/router/guards/hasAnyRoles.js';
// import hasAllRoles from '@/router/guards/hasAllRoles.js';
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
      roles: [defaultAdminRole.name, 'Everyone'],
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
      roles: [defaultAdminRole.name, 'Everyone'],
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
      roles: [defaultAdminRole.name, 'Everyone'],
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
      roles: [defaultAdminRole.name, 'Everyone'],
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
      roles: [defaultAdminRole.name, 'Institution Administrator'],
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
        //   roles: [defaultAdminRole.name, 'asdfasdfasdf'],
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
 * OR
 * @example
 * getRoutesByName('home')
 * OR
 * @example
 * getRoutesByName(['Home', 'Users'])
 *
 * @param {Array[String]} listOfRouteNames - Array of route names.
 * @returns {Array[RouteConfig]} An Array of Type Vue Router
 */
function getRoutesByName(listOfRouteNames) {
  if (typeof listOfRouteNames === 'string') {
    listOfRouteNames = [listOfRouteNames];
  }

  if (
    listOfRouteNames &&
    Array.isArray(listOfRouteNames) &&
    listOfRouteNames.length &&
    routes &&
    routes.length
  ) {
    const reducer = (currentValue) => String(currentValue).toLowerCase();
    listOfRouteNames = listOfRouteNames.map(reducer);
    routes.forEach((route) => {
      const routeName = String(route.name).toLowerCase();
      if (listOfRouteNames.includes(routeName)) {
        const idx = listOfRouteNames.indexOf(routeName);
        listOfRouteNames[idx] = route;
      }
      checkForChildren(route, listOfRouteNames);
    });
  }

  // console.log('listOfRouteNames: ', listOfRouteNames);
  return listOfRouteNames.filter((route) => typeof route === 'object');
}
// #endregion getRoutesByName

// Public Routes
const anonymousItems = getRoutesByName(['Login', 'Settings']);
// Routes for Anyone Logged In
const userItems = getRoutesByName([
  'Home',
  'Schedule',
  'Transfer',
  'Maintenance',
  'Reports',
]);
// Routes for Users with Role Admin
const adminItems = getRoutesByName(['Admin']);
// Routes used for the Toolbar in AppBar.vue
const userToolbarItems = getRoutesByName([
  'Home',
  'Logout',
  'Settings',
  'CDCR Dashboard',
]);

export {
  getRoutesByName,
  anonymousItems,
  userItems,
  adminItems,
  userToolbarItems,
};
export default routes;
