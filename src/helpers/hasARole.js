import store from '@/store/index';
/**
 * hasARole
 * This is a guard helper to check for user has roles before continuing
 * This guard helper does check against the roles currently defined,
 * not just that the appuserroles.roles has a length
 *
 * @returns {Boolean} - Returns true if the user has a role, false if the user does not
 */
// eslint-disable-next-line
const hasARole = () => {
  const appUserRoles = store.getters['users/getAppUserRoles'];
  // console.log({ appUserRoles });
  return Boolean(appUserRoles.length);
};

export default hasARole;
