/**
 * Auto imported vuex module under the namespace "azureAuthentication"
 * This is persisted by default for all applications in the azureDB idB.
 */
import store from '@/store';
import myApp from '@/config/myApp';
import { make } from 'vuex-pathify';

import {
  signIn,
  getTokenPopup,
  signOut,
} from '@/config/private/store/modules/azure/auth';
import {
  seeProfile,
  seeProfilePhoto,
  seeProfilePhotoMeta,
} from '@/config/private/store/modules/azure/graph';

const getDefaultState = () => {
  return {
    azureLoading: false,
    azuretokenresponse: null,
    myInfo: null,
    myPhoto: null,
    myPhotoMetaData: null,
    appName: myApp.name,
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
  AzureAuthentication: async ({ state }) => {
    try {
      store.set('app/loading', true);
      let newTokenResponse = null;
      // The user has already logged in. We try to get his token silently
      if (state.azuretokenresponse && state.azuretokenresponse.account) {
        newTokenResponse = await getTokenPopup(state.azuretokenresponse);
      }
      // No token found, so try logging in the user.  This will pop up the login popup
      // and if signed in, it will go away immediately
      if (!newTokenResponse) {
        newTokenResponse = await signIn('popup');
      }

      if (newTokenResponse) {
        store.set('azureAuthentication/azuretokenresponse', newTokenResponse);

        const azureProfile = await seeProfile(
          newTokenResponse.account.homeAccountId
        );
        store.set('azureAuthentication/myInfo', azureProfile);

        const azurePhoto = await seeProfilePhoto(
          newTokenResponse.account.homeAccountId
        );
        store.set('azureAuthentication/myPhoto', azurePhoto);

        const azurePhotoMeta = await seeProfilePhotoMeta(
          newTokenResponse.account.homeAccountId
        );
        store.set('azureAuthentication/myPhotoMetaData', azurePhotoMeta);
      } else {
        // NO newTokenResponse FOUND
        if (store.azuretokenresponse !== null) {
          store.set('azureAuthentication/azuretokenresponse', null);
        }
      }
    } catch (error) {
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
    } finally {
      store.set('app/loading', false);
    }
  },

  // This signs completely out of Azure including any other applications using this browser (outlook email, Teams, Devops, etc.)
  signOut: ({ state, commit }) => {
    console.log('signOut');
    if (
      state.azuretokenresponse &&
      state.azuretokenresponse.account &&
      state.azuretokenresponse.account.homeAccountId
    ) {
      console.log(
        'signOut with homeAccountId ',
        state.azuretokenresponse.account.homeAccountId
      );
      signOut(state.azuretokenresponse.account.homeAccountId, 'popup');
    }
    console.log('signOut commit resetState');
    commit('resetState');
  },

  logout: ({ commit }) => {
    commit('resetState');
  },

  getTokenPopup: async ({ state }) => {
    store.set('app/loading', true);
    const newTokenResponse = await getTokenPopup(state.azuretokenresponse);
    store.set('azureAuthentication/azuretokenresponse', newTokenResponse);
    store.set('app/loading', false);
    return newTokenResponse;
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
    if (
      state.azuretokenresponse &&
      state.azuretokenresponse.account &&
      state.azuretokenresponse.account.localAccountId
    ) {
      return state.azuretokenresponse.account.localAccountId;
    }
    return null;
  },

  homeAccountId: (state) => {
    if (
      state.azuretokenresponse &&
      state.azuretokenresponse.account &&
      state.azuretokenresponse.account.homeAccountId
    ) {
      return state.azuretokenresponse.account.homeAccountId;
    }
    return null;
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
