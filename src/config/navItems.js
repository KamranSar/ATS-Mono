/**
 * This file contains all the routes used by vue-router
 * By default, all the router items are exported.
 * import routes from "@/config/routeItems.js";
 *
 * Nav Components import by choice.
 * import { anonymousItems, adminItems, userItems, userToolbarItems } from "@/config/routeItems.js";
 */
import {
  requireToken,
  requireAuth,
  requireRoleAdmin,
  logout,
} from '@/router/helpers/guards.js';
import { checkForChildren } from '@/router/helpers/index.js';

/** Filter for routes only in the list
 * @param {Array[String]} listOfRouteNames - Array of route names.
 * @returns {Array[VueRouter]} An Array of Type Vue Router
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
      checkForChildren(route, listOfRouteNames, routeItems);
    });
  }
  return routeItems;
}

const routes = [
  {
    /** custom properties */
    icon: 'mdi-home',
    color: 'primary', // optional
    /** vue-router properties
     * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
     */
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    beforeEnter: requireToken,
    // redirect: // Optional
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
    path: '/logout',
    name: 'Logout',
    beforeEnter: logout,
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

// Public Routes
const anonymousItems = _getRoutesByName(['Login']);
// Routes for Anyone Logged In
const userItems = _getRoutesByName(['Home']);
// Routes for Users with Role Admin
const adminItems = _getRoutesByName(['Admin', 'export templates']);
// Routes used for the Toolbar in AppBar.vue
const userToolbarItems = _getRoutesByName(['Home', 'Logout']);

export { anonymousItems, userItems, adminItems, userToolbarItems };
export default routes;
