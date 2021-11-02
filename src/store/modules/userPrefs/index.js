import { make } from 'vuex-pathify';
import actionsFile from '@/store/modules/userPrefs/actions.js';
import mutationsFile from '@/store/modules/userPrefs/mutations.js';
import getters from '@/store/modules/userPrefs/getters.js';

/**
 * Not all preferences are togglable, just show the ones that are.
 */
const PREFERENCES = [
  /**
   * {
   *  icon: String,
   *  color: String,
   *  header: String,
   * }
   * {
   *  field: String,
   *  label: String,
   *  description: String
   * },
   */
  {
    header: 'Theme Settings',
    icon: 'mdi-brightness-4',
    color: 'yellow darken-2',
  },
  {
    field: 'deviceTheme',
    label: 'Device Theme',
    description: 'Use your device to set the theme settings. (EXPERIMENTAL)',
  },
];

/**
 * * NOTE: User preferences are saved in the middletier and persisted across their mobile and non-mobile devices.
 */
const getDefaultState = () => {
  return {
    deviceTheme: false,
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
  // ! DO NOT SET `persisted`
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export { PREFERENCES, getDefaultState };
