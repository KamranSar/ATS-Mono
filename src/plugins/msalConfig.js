// https://github.com/ahermant/vue-msal-browser
// import { default as msalPlugin } from './msalPlugin';
// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser
import * as msal from '@azure/msal-browser';

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md#logger-config-options
const msalConfig = {
  auth: {
    clientId: 'c0cf535a-bb4d-4731-94fb-8a4165b1a124', // This is the ONLY mandatory field; everything else is optional.
    authority:
      'https://login.microsoftonline.com/0662477d-fa0c-4556-a8f5-c3bc62aa0d9c', // Choose sign-up/sign-in user-flow as your default.
    // authority: 'https://login.microsoftonline.com/common',
    // knownAuthorities: ["https://login.microsoftonline.com"], // You must identify your tenant's domain as a known authority.
    // redirectUri: window.location.origin, // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    redirectUri: window.location.href,
    postLogoutRedirectUri: window.location.href, // This is the default behavior
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
    storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000, // Timeout in milliseconds to wait for popup operations to resolve.
    iframeHashTimeout: 6000, // Timeout in milliseconds to wait for iframe opeations to resolve.
    asyncPopups: true,
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
  scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'],
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
  meEndpoint: 'https://graph.microsoft.com/v1.0/me',
  profilePhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
  profilePhotoMetaEndpoint: 'https://graph.microsoft.com/v1.0/me/photo',
  scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'], // https://docs.microsoft.com/en-us/graph/permissions-reference
};

const silentRequest = {
  scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'],
};

const logoutRequest = {
  account: '', // = myMSALObj.getAccountByHomeId(homeAccountId);
};

export { msalConfig, loginRequest, graphConfig, silentRequest, logoutRequest };
