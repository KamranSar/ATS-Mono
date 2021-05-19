/**
 * This file contains all the routes used by vue-router
 * By default, all the router items are exported.
 * import routes from "@/config/routeItems.js";
 *
 * Nav Components import by choice.
 * import { anonymousItems, adminItems, userItems } from "@/config/routeItems.js";
 */

import { requireToken } from '@/router/helpers/guards.js';
import { checkForChildren } from '@/router/helpers/index.js';
import logout from '@/config/private/helpers/logout';
// import getNewToken from '@/config/private/helpers/getNewToken';
// import Users from '@/feathers/Users';
import Home from '@/views/Home.vue';
// import store from '@/store';

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
    /** custom application properties
     * These can be expanded beyond the default: icon, and onClick properties.
     * Just be sure the '@/components/navigation/' components are updated appropriately.
     */
    icon: 'mdi-home',
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
      can: 'is-admin',
      fail: '4oh4',
    },
    children: [
      {
        icon: 'mdi-account-multiple-outline',
        path: 'users',
        name: 'Users',
        meta: {
          can: 'is-user-admin',
          fail: '4oh4',
        },
        // beforeEnter: async (to, from, next) => {
        //   const getUser = async () => {
        //     await store.set('app/loading', true);
        //     await getNewToken();
        //     const users = await Users.find();
        //     store.set('users/users', users.data);
        //     await store.set('app/loading', false);
        //   };

        //   await getUser();
        //   next();
        // },
        component: () =>
          import(/* webpackChunkName: "users" */ '@/views/Admin/Users.vue'),
        // children: [],
      },
      {
        icon: 'mdi-printer',
        path: 'templates',
        name: 'Export Templates',
        component: () =>
          import(
            /* webpackChunkName: "template" */ '@/views/Admin/Template.vue'
          ),
      },
    ],
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
