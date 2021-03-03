import Vue from 'vue';

import store from '@/store/index';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

function requireAuth(to, from, next) {
  const token = store.get('azureAuthentication/azuretokenresponse');
  if (token) next();
  else next({ name: 'login' });
}

function dynamicHome(to, from, next) {
  const token = store.get('azureAuthentication/azuretokenresponse');
  if (token) next({ name: 'Dashboard' });
  else next();
}

function logout(to, from, next) {
  const token = store.get('azureAuthentication/azuretokenresponse');
  if (token) {
    store.dispatch('azureAuthentication/signOut');
  }
  next({ name: 'login' });
}

const waitForStorageToBeReady = async (to, from, next) => {
  await store.restored; // Set by VuexPersist
  next();
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: dynamicHome,
  },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   component: () =>
  //     import(/* webpackChunkName: "register" */ '../views/Register.vue'),
  // },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () =>
      import(/* webpackChunkName: "pricing" */ '@/views/Pricing.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: logout,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () =>
      import(/* webpackChunkName: "terms" */ '@/views/Terms.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    beforeEnter: requireAuth,
    // beforeEnter: (to, from, next) => {
    //   const token = store.get('azureAuthentication/azuretokenresponse');
    //   if (token) next();
    //   else next({ name: 'home' });
    // },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
  },
  {
    path: '/sr',
    name: 'ServiceReq',
    beforeEnter: requireAuth,
    component: () => import('@/views/ServiceReq.vue'),
  },
  {
    path: '/contact-us',
    name: 'Contact Us',
    component: () =>
      import(/* webpackChunkName: "contact-us" */ '@/views/ContactUs.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    path: '/my-account',
    name: 'my-account',
    beforeEnter: requireAuth,
    redirect: { name: '4oh4' },
  },
  {
    path: '/users',
    name: 'users',
    beforeEnter: requireAuth,
    redirect: { name: '4oh4' },
  },
  {
    path: '/templates',
    name: 'templates',
    redirect: { name: '4oh4' },
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
