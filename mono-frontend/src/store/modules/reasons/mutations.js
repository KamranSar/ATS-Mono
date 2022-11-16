import { getDefaultState } from '@/store/modules/reasons/index.js';

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default mutations;
