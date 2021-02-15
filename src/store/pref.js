import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    leftDrawOpen: false,
    rightDrawOpen: false,
    rightDrawEnabled: true,
    systemBarEnabled: true,
  };
};
const state = getDefaultState();

export default {
  namespaced: true,
  name: 'pref',
  state: state,
  mutations: {
    ...make.mutations(state),
  },
};
