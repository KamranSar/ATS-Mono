// const HtmlWebpackPlugin = require('html-webpack-plugin');

import store from '@/store';

import { make } from 'vuex-pathify';

// import * as msal from '@azure/msal-browser';
import msal from '@/plugins/msalPlugin';

import {
  msalConfig,
  loginRequest,
  silentRequest,
  logoutRequest,
  graphConfig,
} from '@/plugins/msalConfig.js';

// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
// const ua = window.navigator.userAgent;
// const msie = ua.indexOf('MSIE ');
// const msie11 = ua.indexOf('Trident/');
// const msedge = ua.indexOf('Edge/');
// const isIE = msie > 0 || msie11 > 0;
// const isEdge = msedge > 0;

// Create the main myMSALObj instance
// configuration parameters are located at msalConfig.js
// const myMSALObj = new msal.PublicClientApplication(msalConfig);
const myMSALObj = new msal(msalConfig);

const getDefaultState = () => {
  return {
    azureLoading: false,
    azuretokenresponse: null,
    myInfo: null,
    myPhoto: null,
    myPhotoMetaData: null,
    // appName: HtmlWebpackPlugin.options.title,
    appName: 'CDCR Template',
  };
};

// #############################################################################
// #############################################################################
// #############################################################################

/**
 * azureAuthentication State
 */
const state = getDefaultState();

/**
 * azureAuthentication actions
 */
const actions = {
  ...make.actions(state),

  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },

  // Authenticate the user with Azure Active Directory
  AzureAuthentication: async ({ dispatch, state }) => {
    try {
      store.commit('azureAuthentication/azureLoading', true);

      let newTokenResponse = null;
      // The user has already logged in. We try to get his token silently
      if (state.azuretokenresponse && state.azuretokenresponse.account) {
        silentRequest.account = state.azuretokenresponse.account;
        newTokenResponse = await dispatch('getTokenPopup', silentRequest);
      }
      // No token found, so try logging in the user.  This will pop up the login popup
      // and if signed in, it will go away immediately
      if (!newTokenResponse) {
        newTokenResponse = await myMSALObj.loginPopup(loginRequest);
      }
      if (newTokenResponse) {
        store.set('azureAuthentication/azuretokenresponse', newTokenResponse);

        // myMSALObj.setActiveAccount(newTokenResponse.account);
        // There is an existing token, we authentify the user
        // We add the access token as an authorization header for our Axios requests to our API
        if (graphConfig.myInfoEndpoint) {
          // The graph is set, we check if the user has already a picture in the local storage
          // if he does not we grab a token silently for our graph scope and call Microsoft graph to get the picture
          // Get information about logged in user
          let graphResponse = await myMSALObj.callMSGraph(
            graphConfig.myInfoEndpoint,
            newTokenResponse.accessToken
          );
          if (graphResponse.status === 200) {
            // const reader = graphResponse.body.getReader();
            if (graphResponse.body instanceof ReadableStream) {
              const jsondata = await graphResponse.json();
              store.set('azureAuthentication/myInfo', jsondata);
            }
          }
        }

        if (graphConfig.profilePhotoEndpoint) {
          // Try to get their photo if it exists
          let graphResponse = await myMSALObj.callMSGraph(
            graphConfig.profilePhotoEndpoint,
            newTokenResponse.accessToken
          );
          if (graphResponse.status === 200) {
            if (graphResponse.body instanceof ReadableStream) {
              const reader = graphResponse.body.getReader();

              // Read the image in chunks and then re-assemble them into a base64 image
              const binaryData = [];
              // https://web.dev/fetch-upload-streaming/
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                // console.log('Received', value); // Can be used to keep track of chunk numbers
                binaryData.push(value);
              }
              //https://stackoverflow.com/questions/14071463/how-can-i-merge-typedarrays-in-javascript
              const mergedUint8Array = new Uint8Array(
                binaryData
                  .map((typedArray) => [...new Uint8Array(typedArray.buffer)])
                  .flat()
              );
              const base64String = window.btoa(
                String.fromCharCode(...mergedUint8Array)
              );
              store.set('azureAuthentication/myPhoto', base64String);
            }
          }
        }

        // Get the photo meta data
        if (graphConfig.profilePhotoMetaEndpoint) {
          // The graph is set, we check if the user has already a picture in the local storage
          // if he does not we grab a token silently for our graph scope and call Microsoft graph to get the picture
          // if (!localStorage.getItem('userPicture')) {
          // Get information about logged in user
          let graphResponse = await myMSALObj
            .callMSGraph(
              graphConfig.profilePhotoMetaEndpoint,
              newTokenResponse.accessToken
            )
            .catch((error) => {
              console.error(error);
            });
          if (graphResponse.status === 200) {
            // const reader = graphResponse.body.getReader();
            if (graphResponse.body instanceof ReadableStream) {
              try {
                const jsondata = await graphResponse.json();
                store.set('azureAuthentication/myPhotoMetaData', jsondata);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      } else {
        // NO newTokenResponse FOUND
        if (store.azuretokenresponse !== null) {
          store.set('azureAuthentication/azuretokenresponse', null);
        }
      }
    } catch (error) {
      store.commit('azureAuthentication/azureLoading', false);

      console.error('Ah Oh, Programmer. Check this error out...');
      console.error(error);
      if (store.myInfo !== null) {
        store.set('azureAuthentication/myInfo', null);
      }
      if (store.myPhotoMetaData !== null) {
        store.set('azureAuthentication/myPhotoMetaData', null);
      }
      if (store.myPhoto !== null) {
        store.set('azureAuthentication/myPhoto', null);
      }
      if (store.azuretokenresponse !== null) {
        store.set('azureAuthentication/azuretokenresponse', null);
      }
    }

    store.commit('azureAuthentication/azureLoading', false);
  },

  // selectAccount(state, resp) {
  //   if (resp !== null) {
  //     const accountId = resp.account.homeAccountId;
  //     const username = resp.account.username;
  //     const localAccountId = resp.account.localAccountId;
  //     store.set('azureAuthentication/accountId', accountId);
  //     store.set('azureAuthentication/username', username);
  //     store.set('azureAuthentication/localAccountId', localAccountId);
  //     myMSALObj.setActiveAccount(resp.account);
  //   } else {
  //     const currentAccounts = myMSALObj.getAllAccounts();
  //     console.log(
  //       JSON.stringify({ currentLoggedOnAccounts: currentAccounts }, null, 2)
  //     );

  //     if (!currentAccounts || currentAccounts.length < 1) {
  //       console.log('No accounts logged in.');
  //       return;
  //     } else if (currentAccounts.length > 1) {
  //       // Add your account choosing logic here
  //       console.warn('Multiple accounts detected.  Assuming the first account');
  //       const accountId = currentAccounts[0].homeAccountId;
  //       const username = currentAccounts[0].username;
  //       const localAccountId = currentAccounts[0].localAccountId;
  //       store.set('azureAuthentication/accountId', accountId);
  //       store.set('azureAuthentication/username', username);
  //       store.set('azureAuthentication/localAccountId', localAccountId);
  //     } else if (currentAccounts.length === 1) {
  //       const accountId = currentAccounts[0].homeAccountId;
  //       const username = currentAccounts[0].username;
  //       const localAccountId = currentAccounts[0].localAccountId;
  //       store.set('azureAuthentication/accountId', accountId);
  //       store.set('azureAuthentication/username', username);
  //       store.set('azureAuthentication/localAccountId', localAccountId);
  //     }
  //   }
  // },

  // This signs completely out of Azure including any other applications using this browser (outlook email, Teams, Devops, etc.)
  signOut: ({ state, commit }) => {
    if (state.azuretokenresponse && state.azuretokenresponse.account) {
      logoutRequest.account = state.azuretokenresponse.account;
      myMSALObj.logout(logoutRequest);
      commit('resetState');
    }
  },

  logOut: ({ commit }) => {
    commit('resetState');
  },

  // Request a token to be used for a MSGraph call or Middle Tier login
  getTokenPopup: async (state, request) => {
    store.commit('azureAuthentication/azureLoading', true);
    let newtoken = await myMSALObj
      .acquireTokenSilent(request)
      .catch(async (error) => {
        // console.log('silent token acquisition fails.');
        if (error instanceof msal.InteractionRequiredAuthError) {
          // console.log('acquiring token using popup');
          newtoken = myMSALObj.acquireTokenPopup(request).catch((error) => {
            store.commit('azureAuthentication/azureLoading', false);
            throw error;
          });
        } else {
          store.commit('azureAuthentication/azureLoading', false);
          throw error;
        }
      });
    store.commit('azureAuthentication/azureLoading', false);
    return newtoken;
  },

  /**
   *  Dispatches the get Silent Token with popup if needed.
   * @param {dispatch} dispatch
   */
  getAccessTokenPopup: async ({ dispatch }) => {
    try {
      const newToken = await dispatch('getTokenPopup', loginRequest);
      store.set('azureAuthentication/azuretokenresponse', newToken);
    } catch (error) {
      store.set('azureAuthentication/azuretokenresponse', null);
      console.error(error);
    }
  },
};

/**
 * azureAuthentication mutations
 */
const mutations = {
  ...make.mutations(state),

  resetState: (state) => {
    Object.assign(state, getDefaultState());
  },
};

/**
 * azureAuthentication getters
 */
const getters = {
  // ...make.getters(state),

  // Override state var with custom getter
  myPhoto: (state) => {
    if (state.myPhotoMetaData && state.myPhoto) {
      const imageType = state.myPhotoMetaData['@odata.mediaContentType'];
      const imageStr = `data:${imageType};base64,${state.myPhoto}`;
      return imageStr;
    }
    return null;
  },

  localAccountId: (state) => {
    if (state.azuretokenresponse && state.azuretokenresponse.account) {
      const localAccountId = state.azuretokenresponse.account.localAccountId;
      return localAccountId;
    }
    return null;
  },

  tokenExpiration: (state) => {
    const hasToken =
      !!state.azuretokenresponse && !!state.azuretokenresponse.expiresOn;
    if (hasToken) {
      const ExpiresAt = state.azuretokenresponse.expiresOn;
      // console.log(ExpiresAt.toLocaleString());
      return ExpiresAt;
    } else {
      return null;
    }
  },

  isTokenExpired: () => {
    const expDate = store.get('azureAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date();
      // console.log('If', now, '<=', expDate, 'Then Token is Expired');
      if (expDate <= now) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },

  isAzureLoggedIn: (state) => {
    const loggedIn = !!state.azuretokenresponse;
    return loggedIn;
  },

  displayName: (state) => {
    if (state.myInfo) {
      return state.myInfo.displayName || null;
    }
    return null;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
