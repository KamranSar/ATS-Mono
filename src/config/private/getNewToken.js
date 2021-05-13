// https://github.com/davestewart/vuex-pathify/issues/95
import myApp from '@/config/myApp';
import store from '@/store';

const getNewToken = async () => {
  console.log('store: ', store);

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
      await store.dispatch('FeathersAuthentication/authenticate', packet);
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
