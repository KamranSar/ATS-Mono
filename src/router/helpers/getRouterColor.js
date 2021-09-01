import router from '@/router/index.js';

/**
 * Template provided helper to set the icon color if
 * currentRoute is pointing to it or returns an empty string.
 * @param {RouteConfig} item
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

export default getRouterColor;
