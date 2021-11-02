import store from '@/store';
import router from '@/router';
import myApp from '@/config/myApp';
import feathers from '@/feathers/index.js';
import modules from '@/store/modules/index.js';
import onLogout from '@/config/hooks/onLogout.js';

/**
 * logout
 * Call this function to log out of the app
 *
 * @example
 * import logout from "@/config/private/helpers/logout.js";
 * <v-btn @click="logout()">Logout</v-btn>
 *
 */
async function logout() {
  const loggedIn = store.getters['users/isUserLoggedIn'];
  try {
    if (loggedIn) {
      store.dispatch('app/SET_SNACKBAR', {
        top: true,
        center: true,
        message: `Logging out...`,
        color: 'success',
        timeout: 3000,
      });

      await onLogout();

      window.localStorage.removeItem(process.env.VUE_APP_NAME);

      // Get rid of the appid cookie by expiring it and setting it to nothing
      const date = new Date();
      date.setTime(date.getTime() - 1 * 24 * 60 * 60 * 1000); // expire the cookie in the past
      const cookiestr = `x-cdcr-appid= ; expires=${date.toGMTString()}`;
      document.cookie = cookiestr;

      await feathers.logout();
      feathers.authentication.removeAccessToken();
      feathers.authentication.reset();

      store.commit('azureAuthentication/resetState');

      // Run through all modules resetState functions if they have them.
      Object.keys(modules)
        .filter(
          (k) =>
            k !== 'index' &&
            modules[k].mutations &&
            modules[k].mutations.resetState
        )
        .map((moduleName) => store.commit(`${moduleName}/resetState`));

      store.dispatch('app/SET_SNACKBAR', {
        top: true,
        center: true,
        message: `Logged out of ${myApp.name} successfully.`,
        color: 'success',
        timeout: 3000,
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    router.push({ name: 'Login' });
  }
}

export default logout;
