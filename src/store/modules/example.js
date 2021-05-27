import { make } from 'vuex-pathify';
const getDefaultState = () => {
  return {
    exampleData: { foo: 1, bar: 2, biz: 3, baz: 4 },
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
  init: async ({ dispatch }) => {
    //
  },
};
// Vuex Store
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
