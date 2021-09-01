import store from '@/store/';

/**
 * roleCheck
 * Private helper to generalize the way we check if a user has all or any of the passed passed in.
 *
 * @param {Array} [roles = []] roles
 * @param {String} [type="hasAllRoles"] type Options are "hasAllRoles" | "hasAnyRoles"
 * @returns {Boolean} true or false depending on if the roles were enough to pass the given type.
 */
const roleCheck = (roles = [], type = 'hasAllRoles') => {
  // Check the appUserRoles against the roles passed in
  const appUserRoles = store.getters['users/getAppUserRoles'];

  // console.groupCollapsed('roleCheck: ', type, roles);
  // console.log({ roles });
  // console.log({ type });

  // Default to true for no roles;
  // Start with true when checking for all roles
  let retVal = !roles.length || type === 'hasAllRoles' ? true : false;
  for (let index = 0; index < roles.length; index++) {
    const role = roles[index];
    if (type === 'hasAnyRoles' && appUserRoles.includes(role)) {
      retVal = true;
      break;
    } else if (!appUserRoles.includes(role)) {
      retVal = false;
    }
  }

  // console.log({ retVal });
  // console.groupEnd();
  // Return true or false
  return retVal;
};

export default roleCheck;
