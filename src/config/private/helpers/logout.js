import store from '@/store';
import router from '@/router';
import myApp from '@/config/myApp';

/**
 * Template provided helper to logout out of azure and feathers.
 * This function eventually pushes the user to the login page.
 */
async function logout() {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  try {
    if (loggedIn) {
      await store.dispatch('azureAuthentication/logout'); // And always remove the Azure login token.

      store.dispatch('snackbar/setSnack', {
        message: `Logged out of ${myApp.name} successfully.`,
        color: 'success',
      });
      window.localStorage.removeItem(myApp.name);
    }
  } catch (e) {
    console.error(e);
  } finally {
    router.push({ name: 'Login' });
  }
}

export default logout;
