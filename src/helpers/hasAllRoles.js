import roleCheck from '@/helpers/roleCheck.js';

/**
 * hasAllRoles
 * Private helper to check if a user has all of the roles passed in.
 *
 * @param {Array} [roles = []] roles
 * @returns {Boolean} true if the user has all the roles in the array, false otherwise.
 */
const hasAllRoles = (roles = []) => {
  return roleCheck(roles, 'hasAllRoles');
};

export default hasAllRoles;
