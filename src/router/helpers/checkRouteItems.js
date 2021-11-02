import store from '@/store';
import { roleCheck, HAS_ALL, HAS_ANY } from '@/helpers/roleCheck.js';
/**
 * This takes in an array of RouteConfigs and returns true or false after evaluating it's beforeResolve hook to check our roles.
 * This utilizes the roleCheck helper to run through our array of `routeItems`.
 *
 * @param {Array} [ routeItems = [] ] routeItems
 * @param {Boolean} [hasRoles = false] hasRoles
 * @returns {Boolean}
 */
const checkRouteItems = (routeItems = [], hasRoles = false) => {
  const appUserRoles = store.getters['users/getAppUserRoles'];
  if (!appUserRoles.length) return false;

  // Loop through all the matched routes
  for (let index = 0; index < routeItems.length; index++) {
    const route = routeItems[index];
    // console.log('route: ', route);

    // Check the beforeResolve type first...
    let roles = [];
    if (route.meta) {
      // Grab the roles if any
      if (route.meta[HAS_ANY] && route.meta[HAS_ANY].length) {
        roles = route.meta[HAS_ANY];
        hasRoles = roleCheck(roles, HAS_ANY);
      } else if (route.meta[HAS_ALL] && route.meta[HAS_ALL].length) {
        roles = route.meta[HAS_ALL];
        hasRoles = roleCheck(roles, HAS_ALL);
      }
    }

    // console.log(`${type}[${roles.join()}]`, hasRoles);

    if (!hasRoles) break; // Make sure that wherever we're routing to, the parent guards also pass.
  }

  return hasRoles;
};

export default checkRouteItems;
