import store from '@/store';
import router from '@/router';
import azureTokenExpiration from '@/config/private/helpers/azureTokenExpiration';
import feathersTokenExpiration from '@/config/private/helpers/feathersTokenExpiration';
import getMidTierToken from '@/config/private/helpers/getMidTierToken';

/**
 * We need this because doing a users.find() returns all the users but without approles
 * To use this as a helper function outside of hooks, pass feathersClients in a object property called 'app'
 *
 * @returns feathers
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
    if (azureTokenExpiration()) {
      await store.dispatch('azureAuthentication/getTokenPopup');
    }

    if (feathersTokenExpiration()) {
      const midTierToken = await getMidTierToken();

      if (!midTierToken.authentication) {
        store.dispatch('alert/setAlertMsg', 'Failed authentication');
        throw new Error('Failed authentication.');
      }

      const { user, authentication } = midTierToken;
      store.set('users/loggedInUser', { ...user, authentication });
    }
    return true;
  } catch (error) {
    store.commit('users/resetState');
    router.push({ name: 'Login' });
    console.log('getNewToken(): ', error.message);
    return null;
  }
};

export default getNewToken;
