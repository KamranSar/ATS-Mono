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
  if (
    !context.path ||
    context.path === context.app.authentication.options.path
  ) {
    return context;
  }

  try {
    // Conditional around AzureAuthentication to check if expired.
    if (azureTokenExpiration()) {
      await store.dispatch('azureAuthentication/AzureAuthentication');
    }

    // console.log('packet: ', packet);
    // Now sign into Middle Tier
    // console.log(this.isAuthenticated);

    if (feathersTokenExpiration()) {
      const midTierToken = await getMidTierToken();
      const response = await context.app.authenticate(midTierToken);

      if (!response.authentication) {
        throw Error('Failed to authenticate, please try again.');
      }

      let { user } = response;
      const { authentication } = response;
      store.set('users/authentication', authentication);
      store.set('users/user', user);
    }

    return context;
  } catch (error) {
    store.dispatch('alert/setAlertMsg', error.message || '');
    return context;
  }
};

export default getNewToken;
