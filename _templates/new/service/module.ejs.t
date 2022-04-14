---
to: "<%= persisted !== 'No' ? `src/store/modules/${h.changeCase.camel(name)}.js` : null %>"
---
// This example module wraps around a Feathers service
import service from '@/feathers/services/<%= h.changeCase.lower(name) %>/<%= h.changeCase.lower(name) %>.service.js';
// import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';
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
  find: async ({ commit, state }, params) => {
    const response = await service.find(params);
    response.data.forEach((data) => {
      commit.set(state.exampleData[data._id], response);
    });
  },
  get: async ({ commit, state }, id, params) => {
    const response = await service.get(id, params);
    commit.set(state.exampleData[response._id], response);
  },
  create: async ({ commit, state }, data, params) => {
    // TODO: return on response could be an object or an array
    const response = await service.create(data, params);
    commit.set(state.exampleData[response._id], response);
  },
  update: async ({ commit, state }, id, data, params) => {
    // TODO: return on response could be an object or an array
    const response = await service.update(id, data, params);
    commit.set(state.exampleData[id], response);
  },
  patch: async ({ commit, state }, id, data, params) => {
    // TODO: return on user could be an object or an array
    const response = await service.patch(id, data, params);
    commit.set(state.exampleData[id], response);
  },
  remove: async ({ commit, state }, id, params) => {
    await service.remove(id, params);
    delete state.exampleData[id];
    commit.set(state.exampleData, state.exampleData);
  },

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },
};
// Vuex Store
export default {
<% if(persisted !== 'None'){ -%>
  persisted: '<%= persisted %>',
<% } -%>
  namespaced: true,
  state,
  mutations,
  actions,
};
