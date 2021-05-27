import store from '@/store';
import feathers from '@/config/private/feathers';
import myApp from '@/config/myApp';

const getMidTierToken = async () => {
  const _azuretokenresponse =
    store.state['azureAuthentication'].azuretokenresponse;

  if (!_azuretokenresponse) {
    throw Error(
      'Sign in with Azure failed. Network unavailable, please try again.'
    );
  }

  const packet = {
    strategy: 'azuretoken_v1',
    accessToken: _azuretokenresponse.accessToken, // Need the token from Azure to log into middle tier
    cdcrAppID: myApp.cdcrAppID,
  };
  const response = await feathers.authenticate(packet);
  return response;
};

export default getMidTierToken;
