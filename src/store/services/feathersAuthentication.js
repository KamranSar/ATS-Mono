// https://vuex.feathersjs.com/getting-started.html#auth-plugin
// https://vuex.feathersjs.com/auth-plugin.html#configuration

import { makeAuthPlugin } from '@/config/feathers';
import { make } from 'vuex-pathify';
import { servicePath as usersServicePath } from '@/store/services/users';

const getDefaultState = () => {
  return {};
};

const state = getDefaultState();

const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },

  // checkTokenExpired: () => {
  //   const expDate = store.get('feathersAuthentication/tokenExpiration');
  //   if (expDate) {
  //     const now = new Date();
  //     if (now >= expDate) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
  // },

  // calcSecondsToTokenExpire: () => {
  //   const expDate = store.get('feathersAuthentication/tokenExpiration');
  //   if (expDate) {
  //     const now = new Date().getTime();
  //     let secs = Math.round((expDate.getTime() - now) / 1000);
  //     if (secs < 0) {
  //       return null;
  //     }
  //     return secs;
  //   } else {
  //     return null;
  //   }
  // },

  // checkTokenExpiringSoon: () => {
  //   const expDate = store.get('feathersAuthentication/tokenExpiration');
  //   if (expDate) {
  //     const now = new Date();
  //     const minutes = 60; // Alert the user this many minutes before their session expires
  //     const newExpDate = new Date(expDate.getTime() - minutes * 60000);
  //     if (now >= newExpDate) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
  // },
};

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const getters = {
  isOrgAdmin: (state) => {
    return state.user && state.user.role === 'admin';
  },
  // tokenExpiration: () => {
  //   const payload = store.get('feathersAuthentication/payload');
  //   const hasToken =
  //     payload &&
  //     payload.authentication &&
  //     payload.authentication.payload &&
  //     payload.authentication.payload.exp;
  //   if (hasToken) {
  //     const ExpiresAt = new Date(payload.authentication.payload.exp * 1000);
  //     // console.log(ExpiresAt.toLocaleString());
  //     return ExpiresAt;
  //   } else {
  //     return null;
  //   }
  // },
};

export default makeAuthPlugin({
  userService: usersServicePath, // name of user service to call if no user is passed back in the JWT payload
  namespace: 'feathersAuthentication',
  entityIdField: '_id', // ID field in the object returned from authenticating.  Server needs to return _id as well as user.
  responseEntityField: 'user', // Name of user object returned from authenticating.  Usually "user"
  state: state,
  actions: actions,
  mutations: mutations,
  getters: getters,
});
