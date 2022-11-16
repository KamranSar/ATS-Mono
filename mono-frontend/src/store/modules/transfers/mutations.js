import { getDefaultState } from '@/store/modules/transfers/index.js';

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default mutations;
