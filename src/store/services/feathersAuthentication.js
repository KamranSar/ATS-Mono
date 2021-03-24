// https://vuex.feathersjs.com/getting-started.html#auth-plugin
// https://vuex.feathersjs.com/auth-plugin.html#configuration

import { makeAuthPlugin } from '@/feathers-client';
import store from '@/store';
import { make } from 'vuex-pathify';
import { servicePath as usersServicePath } from '@/store/services/users';

const getDefaultState = () => {
  return {
    feathersLoading: false,
    feathersTokenResponse: null,
    // {
    //   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2MTY1NTU4NDUsImV4cCI6MTYxNjU1Njc0NSwiYXVkIjoiaHR0cHM6Ly9hcGlkZXYuY2Rjci5jYS5nb3YiLCJpc3MiOiJjZGNyIiwic3ViIjoiNjA1OTE1YzZmMGM0YzYyZDFlZjM3MjE0IiwianRpIjoiNGQxNzkzMTYtZjkzNC00MmUyLTlmMjEtMTNkYjBjY2Q4MmJjIn0.AANUZX1cNKI6jyqJlW1Y3D_JWRnH4fjM7CYj-IuceZ4",
    //   "user": {
    //     "_id": "605915c6f0c4c62d1ef37214",
    //     "objectSid": "S-1-5-21-1994435998-1945209534-1039588540-768726",
    //     "tenantId": "0662477d-fa0c-4556-a8f5-c3bc62aa0d9c",
    //     "email": "Nathan.Brizzee@cdcr.ca.gov",
    //     "logincount": 10,
    //     "lastloginipaddress": "73.235.117.102",
    //     "prevloginipaddress": "73.235.117.102",
    //     "azureLocalAccountId": "d7f47825-10b1-4b5a-8d71-ff06142f3121",
    //     "username": "NATHAN.BRIZZEE@cdcr.ca.gov",
    //     "firstname": "Nathan",
    //     "lastname": "Brizzee",
    //     "displayname": "Brizzee, Nathan@CDCR",
    //     "lastloginstrategy": "azuretoken_v1.0",
    //     "disabled": false,
    //     "createdAt": "2021-03-22T22:10:14.700Z",
    //     "updatedAt": "2021-03-24T03:17:25.403Z",
    //     "__v": 0
    //   },
    //   "authentication": {
    //     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2MTY1NTU4NDUsImV4cCI6MTYxNjU1Njc0NSwiYXVkIjoiaHR0cHM6Ly9hcGlkZXYuY2Rjci5jYS5nb3YiLCJpc3MiOiJjZGNyIiwic3ViIjoiNjA1OTE1YzZmMGM0YzYyZDFlZjM3MjE0IiwianRpIjoiNGQxNzkzMTYtZjkzNC00MmUyLTlmMjEtMTNkYjBjY2Q4MmJjIn0.AANUZX1cNKI6jyqJlW1Y3D_JWRnH4fjM7CYj-IuceZ4",
    //     "payload": {
    //       "iat": 1616555845,
    //       "exp": 1616556745,
    //       "aud": "https://apidev.cdcr.ca.gov",
    //       "iss": "cdcr",
    //       "sub": "605915c6f0c4c62d1ef37214",
    //       "jti": "4d179316-f934-42e2-9f21-13db0ccd82bc"
    //     }
    //   }
    // }
  };
};

const state = getDefaultState();

const actions = {
  ...make.actions(state),
  // eslint-disable-next-line no-unused-vars
  init: async ({ dispatch }) => {
    //
  },
  FeathersAuthentication: async ({ dispatch, state }) => {
    try {
      store.commit('FeathersAuthentication/feathersLoading', true);

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

      // console.error('Ah Oh, Programmer. Check this error out...');
      // console.error(error);
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
      throw error; // Someone else may need to know about this error
    }

    store.commit('azureAuthentication/azureLoading', false);
  },

  checkTokenExpired: () => {
    const expDate = store.get('feathersAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date();
      if (now >= expDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },

  calcSecondsToTokenExpire: () => {
    const expDate = store.get('feathersAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date().getTime();
      let secs = Math.round((expDate.getTime() - now) / 1000);
      if (secs < 0) {
        return null;
      }
      return secs;
    } else {
      return null;
    }
  },

  checkTokenExpiringSoon: () => {
    const expDate = store.get('feathersAuthentication/tokenExpiration');
    if (expDate) {
      const now = new Date();
      const minutes = 60; // Alert the user this many minutes before their session expires
      const newExpDate = new Date(expDate.getTime() - minutes * 60000);
      if (now >= newExpDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },
};

const mutations = {
  ...make.mutations(state),

  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

const getters = {
  tokenExpiration: () => {
    const payload = store.get('feathersAuthentication/payload');
    const hasToken =
      payload &&
      payload.authentication &&
      payload.authentication.payload &&
      payload.authentication.payload.exp;
    if (hasToken) {
      const ExpiresAt = new Date(payload.authentication.payload.exp * 1000);
      // console.log(ExpiresAt.toLocaleString());
      return ExpiresAt;
    } else {
      return null;
    }
  },

  isFeathersLoggedIn: () => {
    return !!store.get('feathersAuthentication/isAuthenticated');
  },
};

export default makeAuthPlugin({
  userService: usersServicePath, // name of user service to call if no user is passed back in the JWT payload
  namespace: 'feathersAuthentication',
  entityIdField: '_id', // ID field in the object returned from authenticating.  Server needs to return _id as well as user.
  responseEntityField: 'user', // Name of user object returned from authenticating.  Usually "user"
  state: state,
  actions: actions,
  mutations: mutations,
  getters: getters,
});
