import { getDefaultState } from '@/store/modules/users/index.js';

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default mutations;
