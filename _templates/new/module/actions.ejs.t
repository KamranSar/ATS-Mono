---
to: "<%= dedicated ? `src/store/modules/${h.changeCase.camel(name)}/actions.js` : null %>"
---

const actions = {
  // eslint-disable-next-line no-unused-vars
  init: async ({ rootState, state, dispatch }) => {
    //
  },
};

export default actions;
