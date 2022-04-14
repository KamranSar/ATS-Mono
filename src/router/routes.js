/**
 * This file contains all the defined routes for the application
 */

// import Account from '@/views/Settings/Account.vue';
// import UserPreferences from '@/views/Settings/UserPreferences.vue';
/* eslint-disable */
import hasAnyRoles from '@cdcr/vue-frontend/router/guards/hasAnyRoles.js';
import hasAllRoles from '@cdcr/vue-frontend/router/guards/hasAllRoles.js';
/* eslint-enable */
import { defaultAdminRole } from '@/config/myApp.js';

const routes = [
  {
    icon: 'mdi-bus-multiple',
    path: '/transfer',
    name: 'Transfer',
    component: () =>
      import(
        /* webpackChunkName: "Transfer" */ '@/views/Transfer/Transfer.vue'
      ),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Institution User',
        'Guest',
      ],
    },
  },
  {
    icon: 'mdi-bus-multiple',
    path: '/transfer/:cdcrNumber',
    props: true,
    name: 'Transfer Details',
    component: () =>
      import(
        /* webpackChunkName: "TransferDetails" */ '@/views/Transfer/TransferDetails.vue'
      ),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Institution User',
        'Guest',
      ],
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
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Institution User',
        'Guest',
      ],
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
      hasAnyRoles: [
        // defaultAdminRole.name,
        'Institution Administrator',
        'Institution User',
        // 'Guest',
      ],
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
      hasAnyRoles: [
        defaultAdminRole.name,
        'Institution Administrator',
        'Institution User',
        'Guest',
      ],
    },
  },
  {
    icon: 'mdi-file-sign',
    path: '/endorsements',
    name: 'Endorsements',
    component: () =>
      import(/* webpackChunkName: "Endorsements" */ '@/views/Endorsements.vue'),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [
        // defaultAdminRole.name,
        'Institution Administrator',
        'Institution User',
        // 'Guest',
      ],
    },
  },
  {
    icon: 'mdi-account-key-outline',
    name: 'Admin',
    path: '/admin',
    component: () =>
      import(
        /* webpackChunkName: "admin" */ '@cdcr/vue-frontend/views/Admin/Admin.vue'
      ),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [defaultAdminRole.name, 'Institution Administrator'],
    },
    children: [
      {
        // ! DO NOT REMOVE REQUIRED ROUTE --> "/users"
        icon: 'mdi-account-multiple-outline',
        path: 'users',
        name: 'Users',
        component: () =>
          import(
            /* webpackChunkName: "users" */ '@cdcr/vue-frontend/views/Admin/Users.vue'
          ),
        meta: {
          beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
          hasAnyRoles: [defaultAdminRole.name, 'Institution Administrator'],
        },
      },
    ],
  },
  // {
  //   icon: 'mdi-cog-outline',
  //   path: '/settings',
  //   name: 'Settings',
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "settings" */ '@/views/Settings/Settings.vue'
  //     ),
  //   children: [
  //     {
  //       name: 'Account',
  //       path: 'account',
  //       icon: 'mdi-account-outline',
  //       component: Account,
  //     },
  //     {
  //       name: 'Preferences',
  //       path: 'user-preferences',
  //       icon: 'mdi-cog-outline',
  //       component: UserPreferences,
  //       // meta: {
  //       //   beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
  //       //   hasAnyRoles: ['System Administrator'],
  //       // },
  //     },
  //   ],
  // },
];

// Routes used in AppBar.vue
const TopNavItems = [
  // 'Home',
  // 'Settings',
  // 'Admin',
  // 'CDCR Dashboard',
  // 'Settings',
  // 'Login',
  // 'Logout',
];
// Routes used in the v-toolbar in AppBar.vue
const ToolbarItems = [
  'Home',
  'Login',
  'Logout',
  // { name: 'Settings', parentOnly: true },
  // 'CDCR Dashboard',
];
// Routes used in BottomNavBar.vue
const BottomNavItems = ['Home', 'Admin', 'Login', 'Logout'];
// Routes used in NavDrawerLeft.vue
const LeftNavItems = [
  'Home',
  'Endorsements',
  'Schedule',
  'Transfer',
  'Maintenance',
  'Reports',
  'Admin',
  // { name: 'Settings', parentOnly: true },
  'Login',
  // 'Settings',
  'Logout',
];

export { routes, TopNavItems, ToolbarItems, BottomNavItems, LeftNavItems };
export default routes;
