/**
 * This file contains all the routes used by vue-router and the navigation components
 */

import { requireToken } from '@/router/helpers/guards.js';
import { checkForChildren } from '@/router/helpers/index.js';
import logout from '@/config/private/helpers/logout';
import Home from '@/views/Home.vue';

const routes = [
  // {
  //   /** custom application properties
  //    * These can be expanded beyond the default: icon, and onClick properties.
  //    * Just be sure the '@/components/navigation/' components are updated appropriately.
  //    */
  //   icon: 'mdi-home',
  //   onClick: () => alert('Roll for initiative!'), // Set path to '' for onClick to fire.
  //   /** vue-router properties */
  //   path: '',
  //   name: 'Home',
  //   component: Home,
  //   // beforeEnter: Vue Router Guard // Optional,
  //   // redirect: String // Optional
  //   /** vue-browser-acl meta */
  //   meta: { // Optional
  //     can: 'if-admin',
  //     fail: '4oh4',
  //   },
  // },
  {
    icon: 'mdi-home',
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireToken,
  },
  {
    icon: 'mdi-login',
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    icon: 'mdi-logout',
    path: '',
    name: 'Logout',
    onClick: logout,
  },
  {
    icon: 'mdi-arrow-right',
    path: '/signout',
    name: 'Sign Out',
    component: () =>
      import(/* webpackChunkName: "signout" */ '@/views/SignOut.vue'),
  },
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
  // Displayed by default in NavDrawerLeft.vue for admins and user-managers
  {
    icon: 'mdi-account-multiple-outline',
    path: '/users',
    name: 'Users',
    meta: {
      can: 'if-user-manager',
      fail: '4oh4',
    },
    component: () =>
      import(/* webpackChunkName: "users" */ '@/views/Users.vue'),
    // children: [],
  },
  {
    icon: 'mdi-apps',
    path: '/cdcr-dashboard',
    name: 'CDCR Dashboard',
    beforeEnter() {
      location.href = 'http://localhost:8081'; // TODO: Replace this with the cdcr dashboard URL
    },
  },
  {
    // catch all 404
    path: '*',
    name: '4oh4',
    alias: '/404',
    component: () => import('@/views/NotFound.vue'),
  },
];

/** Filter for routes only in the list
 * @param {Array[String]} listOfRouteNames - Array of route names.
 * @returns {Array[VueRouter]} An Array of Type Vue Router
 */
function getRoutesByName(listOfRouteNames) {
  const routeItems = [];
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
      if (listOfRouteNames.includes(String(route.name).toLowerCase())) {
        routeItems.push(route);
      }
      checkForChildren(route, listOfRouteNames, routeItems);
    });
  }
  return routeItems;
}

// Public Routes
const anonymousItems = getRoutesByName(['Login']);
// Routes for Anyone Logged In
const userItems = getRoutesByName(['Home']);
// Routes for Users with Role Admin
const adminItems = getRoutesByName(['Admin']);
// Routes used for the Toolbar in AppBar.vue
const userToolbarItems = getRoutesByName(['Home', 'Logout', 'CDCR Dashboard']);

export {
  getRoutesByName,
  anonymousItems,
  userItems,
  adminItems,
  userToolbarItems,
};
export default routes;
