import store from '@/store';

/**
 * Network tab may show the request as `cancelled`
 *  - But the database call was successfull.
 */
export default () => {
  store.dispatch('userPrefs/saveUserPrefs');
};
