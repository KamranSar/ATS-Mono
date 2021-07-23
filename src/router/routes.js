/**
 * This file contains all the routes used by vue-router and the navigation components
 */

import { checkForChildren } from '@/router/helpers/index.js';
import defaultRoutes from '@/config/private/router/routes.js'; // [Home, Login Logout, Sign Out, Users, 4oh4]

const routes = [
  ...defaultRoutes,
  {
    icon: 'mdi-account-key-outline',
    name: 'Admin',
    path: '/admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/Admin/Admin.vue'),
    meta: {
      can: 'if-admin',
      fail: '4oh4',
    },
  },
];

/** Filter for routes only in the list
 * @param {Array[String]} listOfRouteNames - Array of route names.
 * @returns {Array[VueRouter]} An Array of Type Vue Router
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

// Public Routes
const anonymousItems = getRoutesByName(['Login', 'Settings']);
// Routes for Anyone Logged In
const userItems = getRoutesByName(['Home']);
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
