import { make } from 'vuex-pathify';
import { fetchWithTimeout } from '@/util/req';

const getDefaultState = () => {
  return {
    isOnline: false,
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch, commit }) => {
    // Try on startup
    const result = await dispatch('checkOnlineStatus');
    commit('isOnline', result);

    // Then every so often check again
    setInterval(async () => {
      const result = await dispatch('checkOnlineStatus');
      commit('isOnline', result);
    }, 15000);
  },

  checkOnlineStatus: async () => {
    try {
      const heartbeat = await fetchWithTimeout(
        '/api/auth/v1.0/heartbeat?ping=1',
        {
          method: 'GET',
          timeout: 3000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!heartbeat) {
        return false;
      }

      const online = heartbeat.status >= 200 && heartbeat.status < 300; // either true or false
      // const body = await heartbeat.json();
      return online;
    } catch (err) {
      console.log('heartbeat timeout');
      return false; // definitely offline
    }
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
