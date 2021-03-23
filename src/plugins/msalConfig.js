// https://github.com/ahermant/vue-msal-browser
// import { default as msalPlugin } from './msalPlugin';
// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser
// import * as msal from '@azure/msal-browser';

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md#logger-config-options
const clientAppID = 'c0cf535a-bb4d-4731-94fb-8a4165b1a124'; //Change this to match your application APP ID on Azure
const tenantId = '0662477d-fa0c-4556-a8f5-c3bc62aa0d9c'; // TenantId of CDCR.

const msalConfig = {
  auth: {
    clientId: clientAppID,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    // redirectUri: window.location.origin, // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    // redirectUri: window.location.href,
    postLogoutRedirectUri: window.location.href, // This is the default behavior
    // navigateToLoginRequestUrl: false,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
    storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
  },
  system: {
    // loggerOptions: {
    //   loggerCallback: (level, message, containsPii) => {
    //     if (containsPii) {
    //       return;
    //     }
    //     switch (level) {
    //       case msal.LogLevel.Error:
    //         console.error(message);
    //         return;
    //       case msal.LogLevel.Info:
    //         console.info(message);
    //         return;
    //       case msal.LogLevel.Verbose:
    //         console.debug(message);
    //         return;
    //       case msal.LogLevel.Warning:
    //         console.warn(message);
    //         return;
    //     }
    //   },
    //   piiLoggingEnabled: false,
    // },
    windowHashTimeout: 60000, // Timeout in milliseconds to wait for popup operations to resolve.
    iframeHashTimeout: 6000, // Timeout in milliseconds to wait for iframe opeations to resolve.
    asyncPopups: true,
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
  scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
  myInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
  // profilePhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
  //  A photo size. The supported sizes of HD photos on Microsoft 365 are as follows:
  //  48x48, 64x64, 96x96, 120x120, 240x240, 360x360, 432x432, 504x504, and 648x648.
  //  Photos can be any dimension if they are stored in Azure Active Directory.
  profilePhotoEndpoint:
    'https://graph.microsoft.com/v1.0/me/photos/360x360/$value',
  profilePhotoMetaEndpoint: 'https://graph.microsoft.com/v1.0/me/photo',
  scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'], // https://docs.microsoft.com/en-us/graph/permissions-reference
};

const silentRequest = {
  scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

const logoutRequest = {
  account: '', // = myMSALObj.getAccountByHomeId(homeAccountId);
};

export { msalConfig, loginRequest, graphConfig, silentRequest, logoutRequest };
