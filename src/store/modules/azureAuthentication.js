// const HtmlWebpackPlugin = require('html-webpack-plugin');

import store from '@/store';

import { make } from 'vuex-pathify';

import * as msal from '@azure/msal-browser';
import {
  msalConfig,
  signInTypes,
  loginRequest,
  // silentRequest,
  logoutRequest,
  tokenRequest,
} from '@/plugins/msalConfig.js';

// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf('MSIE ');
const msie11 = ua.indexOf('Trident/');
const msedge = ua.indexOf('Edge/');
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;

// Create the main myMSALObj instance
// configuration parameters are located at msalConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

const getDefaultState = () => {
  return {
    mainTokenResponse: null,
    azuretokenresponse: null,
    exisitingTokenResponse: null,
    username: '',
    // appName: HtmlWebpackPlugin.options.title,
    appName: 'CDCR Template',
    homeAccountId: '',
    accountId: '',
    localAccountId: '',
  };
};

// #############################################################################
// #############################################################################
// #############################################################################

const state = getDefaultState();

const actions = {
  ...make.actions(state),
  // Authenticate the user with Active Directory
  // async AzureAuthentication({ commit, getters, dispatch }) {
  //   try {
  //     let exisitingTokenResponse = getters.mainTokenResponse;
  //     let newTokenResponse = null;
  //     // The user has already logged in. We try to get his token silently
  //     if (exisitingTokenResponse) {
  //       newTokenResponse = await msalInstance.acquireTokenSilent({
  //         account: exisitingTokenResponse.account,
  //         scopes: msalInstance.config.auth.scopes,
  //         forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
  //       });
  //       // The user has not logged in. We check if he comes back from a redirect with a token
  //     } else {
  //       newTokenResponse = await msalInstance.handleRedirectPromise();
  //     }
  //     // No token found, we redirect the user
  //     if (!newTokenResponse) {
  //       const loginRequest = { scopes: msalInstance.config.auth.scopes };
  //       await msalInstance.loginRedirect(loginRequest);
  //       return false;
  //     }
  //     // There is an existing token, we authentify the user
  //     else if (newTokenResponse) {
  //       // We add the access token as an authorization header for our Axios requests to our API
  //       this._vm.axios.defaults.headers.common['Authorization'] =
  //         'Bearer ' + newTokenResponse.accessToken;
  //       if (msalInstance.config.graph) {
  //         // The graph is set, we check if the user has already a picture in the local storage
  //         // if he does not we grab a token silently for our graph scope and call Microsoft graph to get the picture
  //         if (!localStorage.getItem('userPicture')) {
  //           let graphTokenResponse = await msalInstance.getSilentToken(
  //             newTokenResponse.account,
  //             msalInstance.config.graph.scopes
  //           );
  //           let graphResponse = await msalInstance.callMSGraph(
  //             msalInstance.config.graph.url,
  //             graphTokenResponse.accessToken
  //           );
  //           dispatch('AzureSetPicture', graphResponse);
  //         }
  //       }
  //       return true;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  // async AzureAuthentication(state, SignInType) {
  //   try {
  //     const method = isIE || isEdge ? signInTypes.REDIRECT : SignInType;
  //     if (method !== signInTypes.REDIRECT || method !== signInTypes.POPUP) {
  //       throw `signIn Method not a valid sign in type.  Must be either ${signInTypes.POPUP} or ${signInTypes.REDIRECT}`;
  //     }

  //     const exisitingTokenResponse = store.get(
  //       'azureAuthentication/exisitingTokenResponse'
  //     );

  //     let newTokenResponse = null;
  //     // The user has already logged in. We try to get his token silently
  //     if (exisitingTokenResponse) {
  //       silentRequest.account = exisitingTokenResponse.account;
  //       newTokenResponse = await myMSALObj.acquireTokenSilent(silentRequest);
  //       // The user has not logged in. We check if he comes back from a redirect with a token
  //     } else {
  //       newTokenResponse = await myMSALObj.handleRedirectPromise();
  //     }
  //     // No token found, we redirect the user
  //     if (!newTokenResponse) {
  //       if (method === signInTypes.REDIRECT) {
  //         await myMSALObj.loginRedirect(loginRequest);
  //         return false;
  //       } else {
  //         newTokenResponse = await myMSALObj
  //           .acquireTokenSilent(loginRequest)
  //           .catch(async (error) => {
  //             console.log('silent token acquisition fails.');
  //             if (error instanceof msal.InteractionRequiredAuthError) {
  //               console.log('acquiring token using popup');
  //               newTokenResponse = await myMSALObj
  //                 .acquireTokenPopup(loginRequest)
  //                 .catch((error) => {
  //                   console.error(error);
  //                 });
  //             } else {
  //               console.error(error);
  //             }
  //           });
  //       }
  //     }

  //     // There is an existing token, we authentify the user
  //     store.set('azureAuthentication/azuretokenresponse', newTokenResponse);
  //     // We add the access token as an authorization header for our Axios requests to our API
  //     // this._vm.axios.defaults.headers.common['Authorization'] =
  //     //   'Bearer ' + newTokenResponse.accessToken;
  //     // if (msalInstance.config.graph) {
  //     //   // The graph is set, we check if the user has already a picture in the local storage
  //     //   // if he does not we grab a token silently for our graph scope and call Microsoft graph to get the picture
  //     //   if (!localStorage.getItem('userPicture')) {
  //     //     let graphTokenResponse = await myMSALObj.getSilentToken(
  //     //       newTokenResponse.account,
  //     //       msalInstance.config.graph.scopes
  //     //     );
  //     //     let graphResponse = await msalInstance.callMSGraph(
  //     //       msalInstance.config.graph.url,
  //     //       graphTokenResponse.accessToken
  //     //     );
  //     //     dispatch('AzureSetPicture', graphResponse);
  //     //   }
  //     // }
  //     return true;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },

  // async init() {
  //   // Redirect: once login is successful and redirects with tokens, call Graph API
  //   // Redirect: once login is successful and redirects with tokens, call Graph API
  //   myMSALObj
  //     .handleRedirectPromise()
  //     .then(handleResponse)
  //     .catch((err) => {
  //       console.error(err);
  //     });

  //   myMSALObj
  //     .handleRedirectPromise()
  //     .then((response) => {
  //       if (response !== null) {
  //         store.set(
  //           'azureAuthentication/homeAccountId',
  //           response.account.homeAccountId
  //         );
  //         myMSALObj.setActiveAccount(response.account);
  //         // showWelcomeMessage(response.account);
  //       } else {
  //         // need to call getAccount here?
  //         const currentAccounts = myMSALObj.getAllAccounts();
  //         if (!currentAccounts || currentAccounts.length < 1) {
  //           return;
  //         } else if (currentAccounts.length > 1) {
  //           // Multiple accounts defined
  //           // Add choose account code here
  //           console.warn('Multiple accounts detected.');
  //           const activeAccount = currentAccounts[0];
  //           myMSALObj.setActiveAccount(activeAccount);
  //           store.set(
  //             'azureAuthentication/homeAccountId',
  //             activeAccount.homeAccountId
  //           );
  //         } else if (currentAccounts.length === 1) {
  //           const activeAccount = currentAccounts[0];
  //           myMSALObj.setActiveAccount(activeAccount);
  //           store.set(
  //             'azureAuthentication/homeAccountId',
  //             activeAccount.homeAccountId
  //           );
  //           // showWelcomeMessage(activeAccount);
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // },

  // handleResponse(response) {
  //   if (response !== null) {
  //     store.set(
  //       'azureAuthentication/accountId',
  //       response.account.homeAccountId
  //     );
  //     myMSALObj.setActiveAccount(response.account);
  //     // showWelcomeMessage(response.account);
  //   } else {
  //     // need to call getAccount here?
  //     const currentAccounts = myMSALObj.getAllAccounts();
  //     if (!currentAccounts || currentAccounts.length < 1) {
  //       return;
  //     } else if (currentAccounts.length > 1) {
  //       // Multiple accounts defined
  //       // Add choose account code here
  //       console.warn('Multiple accounts detected.');
  //       const activeAccount = currentAccounts[0];
  //       myMSALObj.setActiveAccount(activeAccount);
  //       store.set('azureAuthentication/accountId', activeAccount.homeAccountId);
  //     } else if (currentAccounts.length === 1) {
  //       const activeAccount = currentAccounts[0];
  //       myMSALObj.setActiveAccount(activeAccount);
  //       store.set('azureAuthentication/accountId', activeAccount.homeAccountId);
  //       // showWelcomeMessage(activeAccount);
  //     }
  //   }
  // },

  // async signIn(method) {
  //   if (method !== signInTypes.REDIRECT || method !== signInTypes.POPUP) {
  //     throw {
  //       message:
  //         'signIn Method not a valid sign in type.  Must be either signInTypes.POPUP || signInTypes.REDIRECT',
  //     };
  //   }

  //   let signInType = isIE || isEdge ? signInTypes.REDIRECT : method;

  //   if (signInType === signInTypes.POPUP) {
  //     return myMSALObj
  //       .loginPopup(loginRequest)
  //       .then((response) => {
  //         if (response !== null) {
  //           store.set(
  //             'azureAuthentication/homeAccountId',
  //             response.account.homeAccountId
  //           );
  //           myMSALObj.setActiveAccount(response.account);
  //           // showWelcomeMessage(response.account);
  //         } else {
  //           // need to call getAccount here?
  //           const currentAccounts = myMSALObj.getAllAccounts();
  //           if (!currentAccounts || currentAccounts.length < 1) {
  //             return;
  //           } else if (currentAccounts.length > 1) {
  //             // Multiple accounts defined
  //             // Add choose account code here
  //             console.warn('Multiple accounts detected.');

  //             const activeAccount = currentAccounts[0];
  //             myMSALObj.setActiveAccount(activeAccount);
  //             store.set(
  //               'azureAuthentication/homeAccountId',
  //               activeAccount.homeAccountId
  //             );
  //           } else if (currentAccounts.length === 1) {
  //             const activeAccount = currentAccounts[0];
  //             myMSALObj.setActiveAccount(activeAccount);
  //             store.set(
  //               'azureAuthentication/homeAccountId',
  //               activeAccount.homeAccountId
  //             );
  //             // showWelcomeMessage(activeAccount);
  //           }
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   } else if (signInType === signInTypes.REDIRECT) {
  //     return myMSALObj.loginRedirect(loginRequest);
  //   }
  // },
  selectAccount(state, resp) {
    if (resp !== null) {
      const accountId = resp.account.homeAccountId;
      const username = resp.account.username;
      const localAccountId = resp.account.localAccountId;
      store.set('azureAuthentication/accountId', accountId);
      store.set('azureAuthentication/username', username);
      store.set('azureAuthentication/localAccountId', localAccountId);
      myMSALObj.setActiveAccount(resp.account);
    } else {
      const currentAccounts = myMSALObj.getAllAccounts();
      console.log(
        JSON.stringify({ currentLoggedOnAccounts: currentAccounts }, null, 2)
      );

      if (!currentAccounts || currentAccounts.length < 1) {
        console.log('No accounts logged in.');
        return;
      } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn('Multiple accounts detected.  Assuming the first account');
        const accountId = currentAccounts[0].homeAccountId;
        const username = currentAccounts[0].username;
        const localAccountId = currentAccounts[0].localAccountId;
        store.set('azureAuthentication/accountId', accountId);
        store.set('azureAuthentication/username', username);
        store.set('azureAuthentication/localAccountId', localAccountId);
      } else if (currentAccounts.length === 1) {
        const accountId = currentAccounts[0].homeAccountId;
        const username = currentAccounts[0].username;
        const localAccountId = currentAccounts[0].localAccountId;
        store.set('azureAuthentication/accountId', accountId);
        store.set('azureAuthentication/username', username);
        store.set('azureAuthentication/localAccountId', localAccountId);
      }
    }
  },

  async signIn({ dispatch }, method) {
    if (method !== signInTypes.REDIRECT && method !== signInTypes.POPUP) {
      throw `signIn Method ${method} isnot a valid sign-in type.  Must be either ${signInTypes.POPUP} || ${signInTypes.REDIRECT}`;
    }

    let signInType = isIE || isEdge ? signInTypes.REDIRECT : method;

    const response = await myMSALObj.handleRedirectPromise().catch((error) => {
      console.error(error);
      throw error;
    });
    console.log('handleRedirectPromise Response');
    console.log(response);
    if (response) {
      console.log(JSON.stringify({ handleRedirectPromise: response }, null, 2));
    }

    dispatch('selectAccount', response);

    if (signInType === signInTypes.POPUP) {
      const response = await myMSALObj
        .loginPopup(loginRequest)
        .catch(function (error) {
          console.log(error);
        });
      dispatch('selectAccount', response);
    } else if (signInType === signInTypes.REDIRECT) {
      return myMSALObj.loginRedirect(loginRequest);
    }
  },

  signOut() {
    const localAccountId = store.get('azureAuthentication/localAccountId');
    if (localAccountId) {
      // logoutRequest.account = myMSALObj.getAccountByHomeId(accountId);
      logoutRequest.account = myMSALObj.getAccountByLocalId(localAccountId);
      myMSALObj.logout(logoutRequest);
    }
  },

  async getTokenPopup(state, request) {
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
  },
  // This function can be removed if you do not need to support IE
  async getTokenRedirect(state, request) {
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
  },

  async getAccessTokenPopup({ dispatch }) {
    const accessTokenResponse = await dispatch('getTokenPopup', tokenRequest);
    if (accessTokenResponse) {
      console.log('Popup access_token acquired at: ' + new Date().toString());
      console.log(accessTokenResponse);
      store.set('azureAuthentication/azuretokenresponse', accessTokenResponse);
    }
  },

  async getAccessTokenRedirect({ dispatch }) {
    const accessTokenResponse = await dispatch(
      'getTokenRedirect',
      tokenRequest
    );
    if (accessTokenResponse) {
      console.log(
        'Redirect access_token acquired at: ' + new Date().toString()
      );
      console.log(accessTokenResponse);
      store.set('azureAuthentication/azuretokenresponse', accessTokenResponse);
    }
  },
};

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
