import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    leftDrawEnabled: true,
    rightDrawEnabled: true,
    systemBarEnabled: true,
    footerEnabled: true,
    bottomBarEnabled: true,
  };
};
const state = getDefaultState();

export default {
  namespaced: true,
  name: 'appfeatures',
  state: state,
  mutations: {
    ...make.mutations(state),
  },
};
