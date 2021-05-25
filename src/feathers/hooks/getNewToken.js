import myApp from '@/config/myApp.js';
import store from '@/store';

/**
 * We need this because doing a users.find() returns all the users but without approles
 * To use this as a helper function outside of hooks, pass feathersClients in a object property called 'app'
 *
 * @param {*} context
 * @returns The context with approles appended to users
 */
const getNewToken = async (context) => {
  try {
    await store.dispatch('azureAuthentication/AzureAuthentication');
    const _azuretokenresponse =
      store.state['azureAuthentication'].azuretokenresponse;
    try {
      const packet = {
        strategy: 'azuretoken_v1',
        accessToken: _azuretokenresponse.accessToken, // Need the token from Azure to log into middle tier
        cdcrAppID: myApp.cdcrAppID,
      };
      // console.log('packet: ', packet);
      // Now sign into Middle Tier
      // console.log(this.isAuthenticated);
      const { user } = await context.app.authenticate(packet);
      store.set('users/user', user);
      return context;
    } catch (error) {
      store.dispatch(
        'alert/setAlertMsg',
        'API server Authentication failed. ' + error.message || ''
      );
      return context;
    }
  } catch (error) {
    store.dispatch(
      'alert/setAlertMsg',
      'Sign in with Microsoft failed. ' + error.errorMessage || ''
    );
    return context;
  }
};

export default getNewToken;
