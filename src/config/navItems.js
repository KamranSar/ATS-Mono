/**
 * This file contains all the routes used by vue-router
 * By default, all the router items are exported.
 * import * as routes from "@/config/routeItems.js";
 *
 * Nav Components import by choice.
 * import { anonymousItems, adminItems, userItems, userToolbarItems } from "@/config/routeItems.js";
 */

import {
  requireToken,
  requireAuth,
  requireRoleAdmin,
  dynamicHome,
  dynamicLogin,
  logout,
} from '@/router/guards.js';

/**
 * Checks recursively for any children
 * in the route until no child is left behind.
 * @param {VueRouter} route
 * @param {Array} listOfRouteNames
 * @param {Array} matchedRoutes
 */
function _checkForChildren(route, listOfRouteNames, matchedRoutes) {
  if (route.children && route.children.length) {
    route.children.forEach((route) => {
      if (listOfRouteNames.includes(String(route.name).toLowerCase())) {
        matchedRoutes.push(route);
        _checkForChildren(route, listOfRouteNames, matchedRoutes);
      }
    });
  } else {
    return matchedRoutes;
  }
}

/**
 * Filter for routes only in the list
 * @param {Array[String]} listOfRouteNames - Array of route names.
 * @returns {Array} The route item objects in an Array
 */
function _getRoutesByName(listOfRouteNames) {
  const routeItems = [];
  if (listOfRouteNames && listOfRouteNames.length && routes && routes.length) {
    const reducer = (currentValue) => String(currentValue).toLowerCase();
    listOfRouteNames = listOfRouteNames.map(reducer);

    routes.forEach((route) => {
      if (listOfRouteNames.includes(String(route.name).toLowerCase())) {
        routeItems.push(route);
      }
      _checkForChildren(route, listOfRouteNames, routeItems);
    });
  }
  return routeItems;
}

const routes = [
  {
    /** custom properties */
    icon: 'mdi-home',
    color: 'primary', // optional
    /** vue-router properties */
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    beforeEnter: dynamicHome, // Optional
    // redirect: // Optional
  },
  {
    icon: 'mdi-login',
    path: '/login',
    name: 'Login',
    beforeEnter: dynamicLogin,
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    icon: 'mdi-logout',
    path: '/logout',
    name: 'Logout',
    beforeEnter: logout,
  },
  {
    icon: 'mdi-view-dashboard',
    color: 'success',
    path: '/dashboard',
    name: 'Dashboard',
    beforeEnter: requireToken,
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
  },
  {
    icon: 'mdi-folder-account',
    path: '/my-account',
    name: 'Account',
    // TODO: Create a component for my-account
    // component: () => import(/* webpackChunkName: "account" */ '@/views/Accountvue'),
    beforeEnter: requireAuth,
    redirect: { name: '4oh4' },
  },
  {
    icon: 'mdi-account-key',
    path: '/admin',
    name: 'Admin',
    beforeEnter: requireRoleAdmin,
    component: () =>
      import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
    children: [
      {
        icon: 'mdi-account-multiple',
        path: 'users',
        name: 'Users',
        beforeEnter: requireAuth,
        redirect: { name: '4oh4' },
        children: [
          {
            icon: 'mdi-printer',
            path: 'templates',
            name: 'Export Templates',
            redirect: { name: '4oh4' },
          },
        ],
      },
    ],
  },
  {
    // catch all 404
    path: '/404',
    name: '4oh4',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    // catch all 404
    path: '*',
    component: () => import('@/views/NotFound.vue'),
  },
];

const anonymousItems = _getRoutesByName(['Home', 'Login']);
const userItems = _getRoutesByName(['Dashboard']);
const adminItems = _getRoutesByName(['Admin']);
const userToolbarItems = _getRoutesByName(['Account', 'Logout']);

export { anonymousItems, userItems, adminItems, userToolbarItems };
export default routes;
