import { getDefaultState } from '@/store/modules/destinations/index.js';

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default mutations;
