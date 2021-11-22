import { getDefaultState } from '@/store/modules/userPrefs/index.js';

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default mutations;
