/**
 * Checks recursively for any children
 * in the route until no child is left behind.
 * @param {VueRouter} route
 * @param {Array} listOfRouteNames
 * @param {Array} matchedRoutes
 */
function checkForChildren(route, listOfRouteNames, matchedRoutes) {
  if (route.children && route.children.length) {
    route.children.forEach((route) => {
      if (listOfRouteNames.includes(String(route.name).toLowerCase())) {
        matchedRoutes.push(route);
        checkForChildren(route, listOfRouteNames, matchedRoutes);
      }
    });
  } else {
    return matchedRoutes;
  }
}

export { checkForChildren };
