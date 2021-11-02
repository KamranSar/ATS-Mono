import logout from '@/config/private/helpers/logout';
import Home from '@/views/Home.vue';

const routes = [
  {
    icon: 'mdi-home',
    path: '/',
    name: 'Home',
    component: Home,
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
    icon: 'mdi-apps',
    path: '/cdcr-dashboard',
    name: 'CDCR Dashboard',
    beforeEnter() {
      location.href = window.location.origin;
    },
  },
  {
    // catch all 404
    path: '*',
    name: '4oh4',
    alias: '/404',
    component: () => import('@/views/NotFound.vue'),
  },
  // No Access route for users with no roles
  {
    path: '/noaccess',
    name: 'No Access',
    component: () =>
      import(/* webpackChunkName: "NoAccess" */ '@/views/NoAccess.vue'),
  },
];

export default routes;
