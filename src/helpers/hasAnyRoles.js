import roleCheck from '@/helpers/roleCheck.js';

/**
 * hasAnyRoles
 * Private helper to check if a user has any of the roles passed in.
 *
 * @param {Array} [roles = []] roles
 * @returns {Boolean} true if the user has any of the roles in the array, false otherwise.
 */
const hasAnyRoles = (roles = []) => {
  return roleCheck(roles, 'hasAnyRoles');
};

export default hasAnyRoles;
