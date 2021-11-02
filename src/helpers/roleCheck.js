import store from '@/store/';

const HAS_ALL = 'hasAllRoles';
const HAS_ANY = 'hasAnyRoles';

/**
 * roleCheck
 * Private helper to generalize the way we check if a user has all or any of the roles passed in.
 *
 * @param {Array} [roles = []] roles
 * @param {String} [type="hasAllRoles"] type Options are "hasAllRoles" | "hasAnyRoles"
 * @returns {Boolean} true or false depending on if the roles were enough to pass the given type.
 */
const roleCheck = (roles = [], type = HAS_ALL) => {
  // Check the appUserRoles against the roles passed in
  const appUserRoles = store.getters['users/getAppUserRoles'];

  // console.groupCollapsed('roleCheck: ', type, roles);
  // console.log({ roles });
  // console.log({ type });

  // Default to true for no roles;
  // Start with true when checking for all roles
  let retVal = !roles.length || type === HAS_ALL ? true : false;
  for (let index = 0; index < roles.length; index++) {
    const role = roles[index];
    if (type === HAS_ANY && appUserRoles.includes(role)) {
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

export { roleCheck, HAS_ALL, HAS_ANY };
