/**
 * Template provided helper to check recursively for
 * any children in the route until no child is left behind.
 * @param {RouteConfig} route
 * @param {Array} listOfRouteNames
 */
function checkForChildren(route, listOfRouteNames) {
  if (route.children && route.children.length) {
    route.children.forEach((route) => {
      const routeName = String(route.name).toLowerCase();
      if (listOfRouteNames.includes(String(route.name).toLowerCase())) {
        const idx = listOfRouteNames.indexOf(routeName);
        listOfRouteNames[idx] = route;
      }
      checkForChildren(route, listOfRouteNames);
    });
  }
}

export default checkForChildren;
