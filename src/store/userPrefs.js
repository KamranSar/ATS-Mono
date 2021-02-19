import { make } from 'vuex-pathify';

const getDefaultState = () => {
  return {
    leftDrawOpen: false,
    rightDrawOpen: false,
  };
};
const state = getDefaultState();

export default {
  namespaced: true,
  name: 'userprefs',
  state: state,
  mutations: {
    ...make.mutations(state),
  },
};
