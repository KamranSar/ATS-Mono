import Vue from 'vue';

import VueRouter from 'vue-router';
import waitForStorageToBeReady from '@/router/guards/waitForStorageToBeReady.js';
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

// #region beforeResolve
/**
 * Create a `beforeResolve` hook to fire whenever one is defined in the meta of our Route Record.
 * This allows to call router guards such as `hasAllRoles` and `hasAnyRoles` without interfering with
 * the indiviudal guards at the `beforeEnter` level in the Route Config.
 */
router.beforeResolve(async (to, from, next) => {
  try {
    // For each matched route...
    for (const route of to.matched) {
      await new Promise((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(to, from, (...args) => {
            if (args.length) {
              // Complete the redirect.
              next(...args);
              reject(new Error('Redirected'));
            } else {
              resolve();
            }
          });
        } else {
          // Otherwise, continue resolving the route.
          resolve();
        }
      });
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (error) {
    return;
  }

  // If we reach this point, continue resolving the route.
  next();
});
// #endregion beforeResolve

export default router;
