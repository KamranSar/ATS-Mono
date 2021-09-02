import roleCheck from '@/helpers/roleCheck.js';

/**
 * This takes in an array of RouteConfigs and returns true or false after evaluating it's beforeResolve hook to check our roles.
 * This utilizes the roleCheck helper to run through our array of `routeItems`.
 *
 * @param {Array} [ routeItems = [] ] routeItems
 * @param {Boolean} [hasRoles = false] hasRoles
 * @returns {Boolean}
 */
const checkRouteItems = (routeItems = [], hasRoles = false) => {
  // Loop through all the matched routes
  for (let index = 0; index < routeItems.length; index++) {
    const route = routeItems[index];
    let beforeResolve =
      route.meta && route.meta.beforeResolve
        ? route.meta.beforeResolve.toString()
        : '';

    if (
      beforeResolve.includes('hasAllRoles') ||
      beforeResolve.includes('hasAnyRoles')
    ) {
      const roles =
        route.meta && route.meta.roles && route.meta.roles.length
          ? route.meta.roles
          : [];
      const type = beforeResolve.includes('hasAllRoles')
        ? 'hasAllRoles'
        : 'hasAnyRoles';

      hasRoles = roleCheck(roles, type);
      // console.log(`${type}[${roles.join()}]`, hasRoles);
    }

    if (!hasRoles) break; // Make sure that wherever we're routing to, the parent guards also pass.
  }

  return hasRoles;
};

export default checkRouteItems;
