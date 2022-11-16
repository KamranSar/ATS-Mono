---
to: "<%= dedicated ? `src/store/modules/${h.changeCase.camel(name)}/index.js` : null %>"
---

import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/<%= h.changeCase.camel(name) %>/actions.js';
import mutationsFile from '@/store/modules/<%= h.changeCase.camel(name) %>/mutations.js';
import getters from '@/store/modules/<%= h.changeCase.camel(name) %>/getters.js';

const getDefaultState = () => {
  return {
    // Update your default state here
    exampleData: { foo: 1, bar: 2, biz: 3, baz: 4 },
  };
};

const state = getDefaultState();

const mutations = {
  ...make.mutations(state),
  ...mutationsFile,
};

const actions = {
  ...make.actions(state),
  ...actionsFile,
};

export default {
<% if(persisted !== 'None'){ -%>
  persisted: '<%= persisted %>',
<% } -%>
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export { getDefaultState };
