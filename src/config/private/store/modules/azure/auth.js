/* eslint-disable no-unused-vars */
// https://www.npmjs.com/package/@azure/msal-browser
import * as msal from '@azure/msal-browser';
import { msalConfig, loginRequest } from './authConfig';

// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf('MSIE ');
const msie11 = ua.indexOf('Trident/');
const msedge = ua.indexOf('Edge/');
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;

let signInType;
let accountId = '';

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

// Redirect: once login is successful and redirects with tokens, call Graph API
// This doesn't work with newer browsers due to iphrame blocking
// myMSALObj
//   .handleRedirectPromise()
//   .then(handleResponse)
//   .catch((err) => {
//     console.error(err);
//   });

async function handleResponse(resp) {
  if (resp !== null) {
    accountId = resp.account.homeAccountId;
    myMSALObj.setActiveAccount(resp.account);
    return resp;
    // return resp.account;
  } else {
    // need to call getAccount here?
    const currentAccounts = myMSALObj.getAllAccounts();
    if (!currentAccounts || currentAccounts.length < 1) {
      return null;
    } else if (currentAccounts.length > 1) {
      // Add choose account code here.  Assume the first account for now.
      const activeAccount = currentAccounts[0];
      myMSALObj.setActiveAccount(activeAccount);
      accountId = activeAccount.homeAccountId;
      const acct = await getTokenPopup(activeAccount);
      return acct;
    } else if (currentAccounts.length === 1) {
      const activeAccount = currentAccounts[0];
      myMSALObj.setActiveAccount(activeAccount);
      accountId = activeAccount.homeAccountId;
      const acct = await getTokenPopup(activeAccount);
      return acct;
    } else {
      return null;
    }
  }
}

async function signIn(method = 'popup') {
  signInType = isIE ? 'redirect' : method;
  if (signInType === 'popup') {
    return myMSALObj
      .loginPopup(loginRequest)
      .then(handleResponse)
      .catch(function (error) {
        console.log(error);
      });
  } else if (signInType === 'redirect') {
    return myMSALObj.loginRedirect(loginRequest);
  }
}

async function signOut(accountId, interactionType = 'popup') {
  const logoutRequest = {
    account: myMSALObj.getAccountByHomeId(accountId),
  };

  if (interactionType === 'popup') {
    await myMSALObj.logoutPopup(logoutRequest);
    // window.location.reload();
  } else {
    myMSALObj.logoutRedirect(logoutRequest);
  }
}

async function getTokenPopup(request) {
  if (!request) {
    return null;
  }
  console.log('acquiring token using silent');
  return await myMSALObj.acquireTokenSilent(request).catch(async (error) => {
    console.log('silent token acquisition fails.');
    if (error instanceof msal.InteractionRequiredAuthError) {
      console.log('acquiring token using popup');
      return myMSALObj.acquireTokenPopup(request).catch((error) => {
        console.error(error);
      });
    } else {
      console.error(error);
    }
  });
}

// This function can be removed if you do not need to support IE
async function getTokenRedirect(request) {
  return await myMSALObj.acquireTokenSilent(request).catch(async (error) => {
    console.log('silent token acquisition fails.');
    if (error instanceof msal.InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      console.log('acquiring token using redirect');
      myMSALObj.acquireTokenRedirect(request);
    } else {
      console.error(error);
    }
  });
}

export { myMSALObj, signIn, signOut, getTokenPopup, getTokenRedirect };
