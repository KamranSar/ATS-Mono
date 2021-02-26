// https://github.com/ahermant/vue-msal-browser
// import { default as msalPlugin } from './msalPlugin';
import * as msal from '@azure/msal-browser';

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md#logger-config-options
const msalConfig = {
  auth: {
    clientId: 'c0cf535a-bb4d-4731-94fb-8a4165b1a124', // This is the ONLY mandatory field; everything else is optional.
    authority:
      'https://login.microsoftonline.com/0662477d-fa0c-4556-a8f5-c3bc62aa0d9c', // Choose sign-up/sign-in user-flow as your default.
    // authority: 'https://login.microsoftonline.com/common',
    // knownAuthorities: ["https://login.microsoftonline.com"], // You must identify your tenant's domain as a known authority.
    redirectUri: window.location.origin, // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    postLogoutRedirectUri: window.location.href, // This is the default behavior
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
  scopes: ['User.Read'],
  // scopes: ['openid', 'profile', 'offline_access', 'email', 'User.Read'],
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft-ppe.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft-ppe.com/v1.0/me/messages',
  //   scopes: ['User.Read'], // https://docs.microsoft.com/en-us/graph/permissions-reference
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
  scopes: ['Mail.Read'],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

const silentRequest = {
  scopes: ['openid', 'profile', 'User.Read', 'Mail.Read'],
};

const logoutRequest = {};

const signInTypes = {
  POPUP: 'loginPopup',
  REDIRECT: 'loginRedirect',
};

export {
  msalConfig,
  loginRequest,
  graphConfig,
  tokenRequest,
  silentRequest,
  logoutRequest,
  signInTypes,
};
