/**
 * This file contains all the routes used by vue-router
 * By default, all the router items are exported.
 * import routes from "@/config/routeItems.js";
 *
 * Nav Components import by choice.
 * import { anonymousItems, adminItems, userItems } from "@/config/routeItems.js";
 */

import { requireToken, requireRoleAdmin } from '@/router/helpers/guards.js';
import { checkForChildren } from '@/router/helpers/index.js';
import { logout } from '../router/helpers';

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
    icon: 'fa-home',
    color: 'primary', // Optional - Default: primary
    // onClick: () => {}, // Set path to '' for onClick to fire.
    /** vue-router properties */
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    beforeEnter: requireToken,
    // redirect: // Optional
  },
  {
    icon: 'fa-sign-in-alt',
    color: 'primary',
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    icon: 'fa-sign-out-alt',
    path: '',
    name: 'Logout',
    onClick: logout,
  },
  {
    icon: 'fa-key',
    path: '/admin',
    name: 'Admin',
    beforeEnter: requireRoleAdmin,
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
    children: [
      {
        icon: 'fa-users',
        path: '/users',
        name: 'Users',
        children: [
          {
            icon: 'fa-print',
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
    icon: 'fa-sitemap',
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
const userToolbarItems = getRoutesByName(['Home', 'Logout']);

export {
  getRoutesByName,
  anonymousItems,
  userItems,
  adminItems,
  userToolbarItems,
};
export default routes;
