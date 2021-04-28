import Vue from 'vue';

import store from '@/store/index';
import VueRouter from 'vue-router';
import { waitForStorageToBeReady } from '@/router/guards.js';
import routes from '@/config/navItems.js';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeResolve((to, from, next) => {
  if (to.name) store.set('app/loading', true);
  next();
});

router.beforeEach(waitForStorageToBeReady);

router.afterEach(() => {
  store.set('app/loading', false);
});

export default router;
