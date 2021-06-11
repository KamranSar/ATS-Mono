import store from '@/store';
import router from '@/router';
import myApp from '@/config/myApp';
import feathers from '@/feathers/index.js';

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
      window.localStorage.removeItem(process.env.VUE_APP_NAME);

      // Get rid of the appid cookie by expiring it and setting it to nothing
      const date = new Date();
      date.setTime(date.getTime() - 1 * 24 * 60 * 60 * 1000); // expire the cookie in the past
      const cookiestr = `x-cdcr-appid= ; expires=${date.toGMTString()}`;
      document.cookie = cookiestr;

      await feathers.logout();
      feathers.authentication.removeAccessToken();
      feathers.authentication.reset();
      store.set('azureAuthentication/azuretokenresponse', null);
      store.commit('users/resetState');
    }
  } catch (e) {
    console.error(e);
  } finally {
    router.push({ name: 'Login' });
  }
}

export default logout;
