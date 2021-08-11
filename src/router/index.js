import Vue from 'vue';

import VueRouter from 'vue-router';
import { waitForStorageToBeReady } from '@/router/helpers/guards.js';
import routes from '@/router/routes.js';

// Supress navigation guard uncaught errors
// https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(waitForStorageToBeReady);

export default router;
