/**
 * This file contains all the routes used by vue-router
 * By default, all the router items are exported.
 * import routes from "@/config/routeItems.js";
 *
 * Nav Components import by choice.
 * import { anonymousItems, adminItems, userItems } from "@/config/routeItems.js";
 */

import { requireToken, requireRoleAdmin } from '@/router/helpers/guards.js';
import { checkForChildren, logout } from '@/router/helpers/index.js';
import Home from '@/views/Home.vue';

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

const routes = [
  {
    /** custom properties */
    icon: 'mdi-home',
    color: 'primary', // Optional - Default: primary
    // onClick: () => {}, // Set path to '' for onClick to fire.
    /** vue-router properties */
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireToken,
    // redirect: // Optional
  },
  {
    icon: 'mdi-login',
    color: 'primary',
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
    path: '/admin',
    name: 'Admin',
    beforeEnter: requireRoleAdmin,
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
    children: [
      {
        icon: 'mdi-account-multiple-outline',
        path: '/users',
        name: 'Users',
        children: [
          {
            icon: 'mdi-printer',
            path: '/templates',
            name: 'Export Templates',
            component: () =>
              import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
          },
        ],
      },
    ],
  },
  {
    icon: 'mdi-apps',
    path: '/cdcr-dashboard',
    name: 'CDCR Dashboard',
    beforeEnter() {
      location.href = 'https://apps.cdcr.ca.gov';
    },
  },
  {
    // catch all 404
    path: '*',
    component: () => import('@/views/NotFound.vue'),
  },
];

// Public Routes
const anonymousItems = getRoutesByName(['Login']);
// Routes for Anyone Logged In
const userItems = getRoutesByName(['Home']);
// Routes for Users with Role Admin
const adminItems = getRoutesByName(['Admin', 'export templates']);
// Routes used for the Toolbar in AppBar.vue
const userToolbarItems = getRoutesByName(['Home', 'Logout', 'Sign Out']);

export {
  getRoutesByName,
  anonymousItems,
  userItems,
  adminItems,
  userToolbarItems,
};
export default routes;
