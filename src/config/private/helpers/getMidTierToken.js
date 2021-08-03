import store from '@/store';
import feathers from '@/feathers/index.js';
import { defaultAdminRole, myApp } from '@/config/myApp';

const getMidTierToken = async () => {
  const _azuretokenresponse =
    store.state['azureAuthentication'].azuretokenresponse;

  if (!_azuretokenresponse) {
    throw Error(
      'Sign in with Azure failed. Network unavailable, please try again.'
    );
  }
  let impersonatedSomsUPN = sessionStorage.getItem('impersonatedSomsUPN') || '';
  if (impersonatedSomsUPN) {
    impersonatedSomsUPN = impersonatedSomsUPN.toUpperCase();
  } else {
    impersonatedSomsUPN = '';
  }
  const packet = {
    strategy: 'azuretoken_v1',
    accessToken: _azuretokenresponse.accessToken, // Need the token from Azure to log into middle tier
    cdcrAppID: myApp.azureAppID,
    defaultRole: defaultAdminRole.name, // Gets ignored after the first user creation
    appType: myApp.appType,
    impersonatedSomsUPN,
  };
  try {
    const response = await feathers.authenticate(packet);
    // Set the app id as a session token to be used by the middle tier
    document.cookie = `x-cdcr-appid=${myApp.azureAppID};`;

    return response;
  } catch (error) {
    // console.error('Error getting feathers token ', error);
    return error;
  }
};

export default getMidTierToken;
