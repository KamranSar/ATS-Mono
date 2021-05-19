import router from '@/router/index.js';

/**
 * Template provided helper to check recursively for
 * any children in the route until no child is left behind.
 * @param {VueRouter} route
 * @param {Array} listOfRouteNames
 * @param {Array} matchedRoutes
 */
function checkForChildren(route, listOfRouteNames, matchedRoutes) {
  if (route.children && route.children.length) {
    route.children.forEach((route) => {
      if (listOfRouteNames.includes(String(route.name).toLowerCase())) {
        matchedRoutes.push(route);
      }
      checkForChildren(route, listOfRouteNames, matchedRoutes);
    });
  } else {
    return matchedRoutes;
  }
}

/**
 * Template provided helper to call either the router.push with the path
 * or the onClick event if path is empty.
 * @param {VueRouter} item
 */
const onClick = (item) => {
  if (item) {
    if (item.path && router.currentRoute.name !== item.name) {
      router.push({ name: item.name });
    } else if (item.onClick) {
      item.onClick();
    }
  }
};

/**
 * Template provided helper to set the icon color if
 * currentRoute is pointing to it or returns an empty string.
 * @param {VueRouter} item
 * @returns {String} primary if currentRoute.name matches otherwise an empty string.
 */
const getRouterColor = (item) => {
  if (
    router &&
    router.currentRoute &&
    router.currentRoute.name &&
    router.currentRoute.name === item.name
  ) {
    return 'primary';
  } else {
    return '';
  }
};

export { checkForChildren, onClick, getRouterColor };
