import { requireToken } from '@/router/helpers/guards.js';
import logout from '@/config/private/helpers/logout';
import Home from '@/views/Home.vue';

const routes = [
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
    icon: 'mdi-cog-outline',
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
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
    icon: 'mdi-apps',
    path: '/cdcr-dashboard',
    name: 'CDCR Dashboard',
    beforeEnter() {
      location.href = window.location.origin;
    },
  },
  // Displayed by default in NavDrawerLeft.vue for admins
  {
    icon: 'mdi-account-multiple-outline',
    path: '/users',
    name: 'Users',
    meta: {
      can: 'if-user-admin',
      fail: '4oh4',
    },
    component: () =>
      import(/* webpackChunkName: "users" */ '@/views/Users.vue'),
    // children: [],
  },
  {
    // catch all 404
    path: '*',
    name: '4oh4',
    alias: '/404',
    component: () => import('@/views/NotFound.vue'),
  },
];

export default routes;
