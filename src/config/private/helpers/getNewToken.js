import myApp from '@/config/myApp';
import store from '@/store';
import feathers from '@/config/private/feathers';

/**
 * Call this function to get a new token silently
 *
 * import getNewToken from "@/config/private/helpers/getNewToken.js";
 * <v-btn @click="getNewToken()">Extend current session</v-btn>
 */
const getNewToken = async () => {
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
      const { user } = await feathers.authenticate(packet);
      store.set('users/user', user);
    } catch (error) {
      store.dispatch(
        'alert/setAlertMsg',
        'API server Authentication failed. ' + error.message || ''
      );
    }
  } catch (error) {
    store.dispatch(
      'alert/setAlertMsg',
      'Sign in with Microsoft failed. ' + error.errorMessage || ''
    );
  }
};

export default getNewToken;
