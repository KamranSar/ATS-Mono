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
    // Conditional around AzureAuthentication to check if expired.
    if (azureTokenExpiration()) {
      await store.dispatch('azureAuthentication/AzureAuthentication');
    }

    // When calling getNewToken directly, path does not exist
    // If the context.path is not already authentication... authenticate
    const authPath = context.app.authentication.options.path.substr(1);
    if (!context.path || (context.path && context.path !== authPath)) {
      const expired = feathersTokenExpiration();
      if (expired) {
        const midTierToken = await getMidTierToken();

        if (!midTierToken.authentication) {
          throw Error('Failed to authenticate, please try again.');
        }

        let { user } = midTierToken;
        const { authentication } = midTierToken;
        store.set('users/authentication', authentication);
        store.set('users/user', user);
      }
    }
    return context;
  } catch (error) {
    store.dispatch('alert/setAlertMsg', error.message || '');
    return context;
  }
};

export default getNewToken;
