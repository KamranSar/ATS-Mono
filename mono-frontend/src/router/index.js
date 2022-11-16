import Vue from 'vue';

import VueRouter from 'vue-router';
import waitForStorageToBeReady from '@cdcr/vue-frontend/router/guards/waitForStorageToBeReady.js';
import checkUserRoles from '@cdcr/vue-frontend/router/guards/checkUserRoles.js';
import { routes } from '@cdcr/vue-frontend/router/index.js'; // All required + application specific routes

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(waitForStorageToBeReady);
router.beforeResolve(checkUserRoles);

export default router;
