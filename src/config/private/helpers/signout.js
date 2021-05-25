import store from '@/store';
import router from '@/router';
import logout from '@/config/private/helpers/logout';

/**
 * Call this function to sign out of the app
 * This will remove their auth from all other connected cdcr and microsoft apps.
 *
 * import signout from "@/config/private/helpers/signout.js";
 * <v-btn @click="signout()">Sign Out</v-btn>
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

export default signout;
