import store from '@/store';
import router from '@/router';
import azureTokenExpiration from '@/config/private/helpers/azureTokenExpiration';
import feathersTokenExpiration from '@/config/private/helpers/feathersTokenExpiration';
import getMidTierToken from '@/config/private/helpers/getMidTierToken';
import feathers from '@/feathers/index.js';

/**
 * We need this because doing a users.find() returns all the users but without approles
 * To use this as a helper function outside of hooks, pass feathersClients in a object property called 'app'
 *
 * @returns feathers
 */
const getNewToken = async () => {
  try {
    // If I don't have an azure token, return
    const azureToken = store.get('azureAuthentication/azuretokenresponse');
    if (!azureToken) {
      router.push({ name: 'Login' });
      return;
    }

    // Conditional around AzureAuthentication to check if expired.
    if (azureTokenExpiration()) {
      await store.dispatch('azureAuthentication/getTokenPopup');
    }

    if (feathersTokenExpiration()) {
      const midTierToken = await getMidTierToken();

      if (!midTierToken.authentication) {
        throw Error('Failed to authenticate, please try again.');
      }

      const { user, authentication } = midTierToken;
      store.set('users/loggedInUser', { ...user, authentication });
    }
    return feathers;
  } catch (error) {
    store.dispatch('alert/setAlertMsg', error.message || '');
    return feathers;
  }
};

export default getNewToken;
