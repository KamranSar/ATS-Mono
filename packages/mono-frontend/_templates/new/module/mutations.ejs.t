---
to: "<%= dedicated ? `src/store/modules/${h.changeCase.camel(name)}/mutations.js` : null %>"
---
import { getDefaultState } from '@/store/modules/<%= h.changeCase.camel(name) %>/index.js';

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default mutations;

