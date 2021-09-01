import router from '@/router/index.js';

/**
 * Template provided helper to call either the router.push with the path
 * or the onClick event if path is empty.
 * @param {RouteConfig} item
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

export default onClick;
