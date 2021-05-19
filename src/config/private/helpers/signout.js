import store from '@/store';
import router from '@/router';
import logout from '@/config/private/helpers/logout';

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

export default signout;
