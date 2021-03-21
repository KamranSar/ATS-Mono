// https://vuex.feathersjs.com/getting-started.html#auth-plugin
// https://vuex.feathersjs.com/auth-plugin.html#configuration

import { makeAuthPlugin } from '@/feathers-client';
import store from '@/store';
import { make } from 'vuex-pathify';
import { servicePath as usersServicePath } from '@/store/services/users';

const getDefaultState = () => {
  return {
    isTokenExpired: true,
    isTokenExpiringSoon: true,
  };
};

const state = getDefaultState();

const actions = {
  ...make.actions(state),
  init: async ({ dispatch, commit }) => {
    // Check if token is expired...
    setInterval(async () => {
      // Check if token is expired...
      const isExpired = store.get('feathersAuthentication/isTokenExpired');
      const isExpiring = store.get(
        'feathersAuthentication/isTokenExpiringSoon'
      );
      const checkToExpired = await dispatch('checkTokenExpired');
      const checkToExpireSoon = await dispatch('checkTokenExpiringSoon');
      if (isExpired !== checkToExpired) {
        commit('isTokenExpired', checkToExpired);
      }
      if (isExpiring !== checkToExpireSoon) {
        commit('isTokenExpiringSoon', checkToExpireSoon);
      }
    }, 500);
  },

  checkTokenExpired: () => {
    const expDate = store.get('feathersAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date();
      if (now >= expDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },

  calcSecondsToTokenExpire: () => {
    const expDate = store.get('feathersAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date().getTime();
      let secs = Math.round((expDate.getTime() - now) / 1000);
      if (secs < 0) {
        return null;
      }
      return secs;
    } else {
      return null;
    }
  },

  checkTokenExpiringSoon: () => {
    const expDate = store.get('feathersAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date();
      const minutes = 60; // Alert the user this many minutes before their session expires
      const newExpDate = new Date(expDate.getTime() - minutes * 60000);
      if (now >= newExpDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },
};

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const getters = {
  tokenExpiration: () => {
    const payload = store.get('feathersAuthentication/payload');
    const hasToken =
      payload &&
      payload.authentication &&
      payload.authentication.payload &&
      payload.authentication.payload.exp;
    if (hasToken) {
      const ExpiresAt = new Date(payload.authentication.payload.exp * 1000);
      // console.log(ExpiresAt.toLocaleString());
      return ExpiresAt;
    } else {
      return null;
    }
  },

  isFeathersLoggedIn: () => {
    return !store.get('feathersAuthentication/isTokenExpired');
  },
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
