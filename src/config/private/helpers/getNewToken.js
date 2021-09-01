import store from '@/store';
import router from '@/router';
import feathersTokenExpiration from '@/config/private/helpers/feathersTokenExpiration';
import getMidTierToken from '@/config/private/helpers/getMidTierToken';

/**
 * @name getNewToken
 * This private helper can be called any time throughout the application but not NOT required.
 *
 * This private helper gets called on a setInterval we've created on `main.js`.
 * This is also called during a refresh of all our vuex modules in `waitForStorageToBeReady`.
 */
const getNewToken = async () => {
  try {
    // console.log('getNewToken called -> ', Date().toLocaleString());
    // If you're not online, return null
    // TODO: How to handle null from caller?
    if (!window.navigator.onLine) {
      console.log('Not online so skip new token');
      return null;
    }

    // If I don't have an azure token, return
    const azureToken = store.get('azureAuthentication/azuretokenresponse');
    if (!azureToken) {
      // If we aren't signed in, send them back to log in.
      throw new Error(
        'Failed to authenticate with identity management or not logged in.'
      );
    }

    // Conditional around AzureAuthentication to check if expired.
    if (feathersTokenExpiration()) {
      await store.dispatch('azureAuthentication/getTokenPopup');
      const midTierToken = await getMidTierToken();

      if (!midTierToken.authentication) {
        store.dispatch('app/SET_ALERT', {
          type: 'error',
          message: 'Failed authentication',
        });
        throw new Error('Failed authentication.');
      }

      const { user, authentication } = midTierToken;
      store.set('users/loggedInUser', { ...user, authentication });
    }
    return true;
  } catch (error) {
    // TODO: Catch cancel on getTokenPopup
    store.commit('users/resetState');
    router.push({ name: 'Login' });
    console.log('getNewToken(): ', error.message);
    throw Error(error);
  }
};

export default getNewToken;
