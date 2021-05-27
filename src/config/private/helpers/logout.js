import store from '@/store';
import router from '@/router';
import myApp from '@/config/myApp';

/**
 * Call this function to log out of the app
 *
 * import logout from "@/config/private/helpers/logout.js";
 * <v-btn @click="logout()">Logout</v-btn>
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
      store.commit('users/resetState');
    }
  } catch (e) {
    console.error(e);
  } finally {
    router.push({ name: 'Login' });
  }
}

export default logout;
