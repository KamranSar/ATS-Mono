/**
 * This file contains all the defined routes for the application
 */

// import Account from '@/views/Settings/Account.vue';
// import UserPreferences from '@/views/Settings/UserPreferences.vue';
/* eslint-disable */
import hasAnyRoles from '@cdcr/vue-frontend/router/guards/hasAnyRoles.js';
import hasAllRoles from '@cdcr/vue-frontend/router/guards/hasAllRoles.js';
/* eslint-enable */
import { SYS_ADMIN, INST_ADMIN, INST_USER, GUEST } from '@/helpers/appRoles.js';

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
        SYS_ADMIN.name,
        INST_ADMIN.name,
        INST_USER.name,
        GUEST.name,
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
        SYS_ADMIN.name,
        INST_ADMIN.name,
        INST_USER.name,
        GUEST.name,
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
        SYS_ADMIN.name,
        INST_ADMIN.name,
        INST_USER.name,
        GUEST.name,
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
        SYS_ADMIN.name,
        INST_ADMIN.name,
        INST_USER.name,
        GUEST.name,
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
      hasAnyRoles: [INST_ADMIN.name, INST_USER.name],
    },
  },
  {
    icon: 'mdi-cog-outline',
    name: 'Maintenance',
    path: '/maintenance',
    component: () =>
      import(
        /* webpackChunkName: "maintenance" */ '@/views/Maintenance/Maintenance.vue'
      ),
    meta: {
      beforeResolve: (to, from, next) => hasAnyRoles(to, from, next),
      hasAnyRoles: [SYS_ADMIN.name, INST_ADMIN.name, INST_USER.name],
    },
    children: [
      {
        icon: 'mdi-map-marker',
        path: 'destinations',
        name: 'Destinations',
        component: () =>
          import(
            /* webpackChunkName: "Destinations" */ '@/views/Maintenance/Destinations.vue'
          ),
      },
      {
        icon: 'mdi-adjust', // mdi-adjust, mdi-tag, mdi-tooltip
        path: 'transferreasons',
        name: 'Transfer Reasons',
        component: () =>
          import(
            /* webpackChunkName: "TransferReasons" */ '@/views/Maintenance/TransferReasons.vue'
          ),
      },
    ],
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
      hasAnyRoles: [SYS_ADMIN.name, INST_ADMIN.name],
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
          hasAnyRoles: [SYS_ADMIN.name, INST_ADMIN.name],
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
  'Reports',
  'Maintenance',
  'Admin',
  // { name: 'Settings', parentOnly: true },
  'Login',
  // 'Settings',
  'Logout',
];

export { routes, TopNavItems, ToolbarItems, BottomNavItems, LeftNavItems };
export default routes;
