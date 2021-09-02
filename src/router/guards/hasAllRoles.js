/**
 * Router Guards used by Vue-Router
 */

import checkRouteItems from '@/router/helpers/checkRouteItems.js';

/**
 * hasAllRoles
 * Check to confirm the loggedInUser has ALL the roles passed in.
 * Sends them to No Access if any of roles don't check out.
 *
 * @example
 * Example route object:
 * {
 *  icon: 'mdi-account-key-outline',
 *  name: 'Admin',
 *  path: '/admin',
 *  component: Admin,
 *  meta: {
 *      beforeResolve: (to, from, next) => hasAllRoles(to, from, next, "4oh4"),
 *      roles: [defaultAdminRole.name],
 *    }
 * }
 *
 * @param {*} to
 * @param {*} from
 * @param {*} next
 * @param {String} [noAccessRoute="No Access"] noAccessRoute - The NAME of the route if all of the roles don't check out

 */
const hasAllRoles = (to, from, next, noAccessRoute = 'No Access') => {
  let hasRoles = true; // Default to true for hasAllRoles

  hasRoles = checkRouteItems(to.matched, hasRoles);

  if (hasRoles) {
    next();
  } else {
    next({ name: noAccessRoute });
  }
};

export default hasAllRoles;
