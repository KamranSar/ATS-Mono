// Pathify
import cloneDeep from 'lodash.clonedeep';
import { make } from 'vuex-pathify';

const VALID_TYPES = ['success', 'info', 'warning', 'error'];
const DEFAULT_ALERT = {
  type: VALID_TYPES[0], // success, info, warning, error
  message: '',
  button: '', // Give your button a name
  onClick: null, // Handle your onClick event
};
const DEFAULT_SNACKBAR = {
  show: false,
  top: true,
  bottom: false,
  left: false,
  right: false,
  centered: false,
  message: '',
  color: '',
  timeout: 6000,
};

const getDefaultState = () => {
  return {
    alert: cloneDeep(DEFAULT_ALERT),
    snackbar: cloneDeep(DEFAULT_SNACKBAR),
    loading: false, // route change triggers this
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

  /**
   * SET_ALERT
   * This helper function is used to set the global alert component with the options passed in.
   * Ignore params to clear the alert
   *
   * @param {Object=DEFAULT_ALERT} options
   */
  SET_ALERT: async ({ state }, options = cloneDeep(DEFAULT_ALERT)) => {
    if (options.message) {
      options.type = options.type.toLowerCase();
      state.alert.message = options.message;
      state.alert.type = VALID_TYPES.includes(options.type)
        ? options.type
        : DEFAULT_ALERT.type;
      state.alert.button = options.button
        ? options.button
        : DEFAULT_ALERT.button;
      state.alert.onClick = options.onClick
        ? options.onClick
        : DEFAULT_ALERT.onClick;
    } else {
      state.alert = cloneDeep(DEFAULT_ALERT);
    }
  },

  /**
   * SET_SNACKBAR
   * This helper function is used to set the global snackbar component with the options passed in.
   * Ignore params to clear the snackbar
   *
   * @param {Object=DEFAULT_SNACKBAR} options
   */
  SET_SNACKBAR: async ({ state }, options = cloneDeep(DEFAULT_SNACKBAR)) => {
    // Clear previous snackbar position just in case of conflicts:
    const VALID_POSITIONS = ['top', 'bottom', 'left', 'right', 'center'];
    VALID_POSITIONS.forEach((position) => (state.snackbar[position] = false));

    if (options.message) {
      state.snackbar.show = true;
      state.snackbar.top = options.top;
      state.snackbar.bottom = options.bottom;
      state.snackbar.left = options.left;
      state.snackbar.right = options.right;
      state.snackbar.centered = options.centered;
      state.snackbar.message = options.message;
      state.snackbar.color = options.color;
      state.snackbar.timeout = options.timeout
        ? options.timeout
        : DEFAULT_SNACKBAR.timeout;
    }
  },

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export { VALID_TYPES, DEFAULT_ALERT, DEFAULT_SNACKBAR };
