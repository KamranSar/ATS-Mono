import router from '@/router/index.js';
import store from '@/store/index.js';
import myApp from '@/config/myApp.js';

/**
 * Template provided helper to logout out of azure and feathers.
 * This function eventually pushes the user to the login page.
 */
async function logout() {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  try {
    if (loggedIn) {
      // const feathersLoggedIn = store.get(
      //   'FeathersAuthentication/isAuthenticated'
      // );

      // FIXME: (feathersLoggedIn) always returns false and we get a DELETE forbidden
      // if (feathersLoggedIn) {
      await store.dispatch('FeathersAuthentication/logout', {
        strategy: 'jwt',
      }); // log out of Feathers. Removes the local jwt and calls the api server to log out
      // If the JWT has already expired, we will get a 401 or 403 error back from the server which is OK.
      // We disable the ability to renew (or delete) JWT's this way.  We can only call the POST (authenticate)
      // method now for security reasons.
      // console.log('successfully logged out of api server');
      // }

      await store.dispatch('azureAuthentication/logout'); // And always remove the Azure login token.
      await store.commit('Users/clearAll');

      store.dispatch('snackbar/setSnack', {
        message: `Logged out of ${myApp.name} successfully.`,
        color: 'success',
      });
    }
  } catch (e) {
    // console.error(e);
  } finally {
    router.push({ name: 'Login' });
  }
}

/**
 * Template provided helper to sign the user out of the microsoft web space.
 * This includes teams, outlook, word, powerpoint, and any other microsoft related products.
 * This function eventually pushes the user to the login page.
 */
async function signout() {
  try {
    await store.dispatch('azureAuthentication/signOut');
    await logout();
  } catch (e) {
    // console.error(e);
  } finally {
    router.push({ name: 'Login' });
  }
}

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
    if (item.path && router.currentRoute.path !== item.path) {
      router.push(item.path).catch(() => {});
    } else if (item.onClick) {
      item.onClick();
    }
  }
};

/**
 * Template provided helper to safely grab the icon color if
 * currentRoute is pointing to it or returns an empty string.
 * @param {VueRouter} item
 * @returns {String} item.color if currentRoute.name matches or an empty string
 */
const getRouterColor = (item) => {
  return router &&
    router.currentRoute &&
    router.currentRoute.name &&
    router.currentRoute.name === item.name
    ? item.color
      ? item.color
      : 'primary'
    : '';
};

export { logout, signout, checkForChildren, onClick, getRouterColor };
