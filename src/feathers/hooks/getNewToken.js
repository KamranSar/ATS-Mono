import store from '@/store';
import azureTokenExpiration from '@/config/private/helpers/azureTokenExpiration';
import feathersTokenExpiration from '@/config/private/helpers/feathersTokenExpiration';
import getMidTierToken from '@/config/private/helpers/getMidTierToken';

/**
 * We need this because doing a users.find() returns all the users but without approles
 * To use this as a helper function outside of hooks, pass feathersClients in a object property called 'app'
 *
 * @param {*} context
 * @returns The context with approles appended to users
 */
const getNewToken = async (context) => {
  try {
    // When calling getNewToken directory, no path is passed int
    // Let it run to completion
    if (!context.path) {
      // Conditional around AzureAuthentication to check if expired.
      if (azureTokenExpiration()) {
        await store.dispatch('azureAuthentication/AzureAuthentication');
      }

      // Skip if path does not equal auth when path exists.
      if (
        context.path &&
        context.path !== context.app.authentication.options.path
      ) {
        return context;
      } else if (feathersTokenExpiration()) {
        const midTierToken = await getMidTierToken();

        if (!midTierToken.authentication) {
          throw Error('Failed to authenticate, please try again.');
        }

        let { user } = midTierToken;
        const { authentication } = midTierToken;
        store.set('users/authentication', authentication);
        store.set('users/user', user);
      }

      return context;
    }
  } catch (error) {
    store.dispatch('alert/setAlertMsg', error.message || '');
    return context;
  }
};

export default getNewToken;
