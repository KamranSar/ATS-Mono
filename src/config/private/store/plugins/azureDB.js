/**
 * All apps will share the same azureDB iDB Collection to avoid storing duplicate data.
 */
import VuexPersistence from '@/../local_modules/vuex-persist';
import localForage from 'localforage';
import pako from 'pako';

const PROD_ENV = process.env.NODE_ENV === 'production'; // Only do compression during production
const STORAGE_NAME = 'azureDB'; // All apps will share the same azureDB instance.

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: STORAGE_NAME, // database name
  storeName: 'azureInfo', // table name
});

const vuexPersist = new VuexPersistence({
  key: STORAGE_NAME, // The key to store the state on in the storage provider.
  storage: localForageInstance, // or window.sessionStorage, window.localStorage, or localForage
  asyncStorage: true, // needed for localforage
  restoreState: async (key) => {
    try {
      let data;
      data = await localForageInstance.getItem(key);
      if (PROD_ENV) {
        data = pako.inflate(data, { level: 6 });
        data = JSON.parse(new TextDecoder('utf-8').decode(data));
      }
      return data;
    } catch (e) {
      return e;
    }
  },
  saveState: (key, state) => {
    // You can manipulate the state here before it goes into the database - such as encrypt certain keys
    // console.log(key, state);
    try {
      let data = state;
      if (PROD_ENV) {
        data = new TextEncoder().encode(JSON.stringify(state));
        data = pako.deflate(data, { level: 6 });
      }
      return localForageInstance.setItem(key, data);
    } catch (error) {
      return error;
    }
  },
  // only save these fields from the state
  reducer: (state) => {
    // Your reducer should not change the shape of the state.
    // https://github.com/championswimmer/vuex-persist#reducer
    // console.dir(state);
    return {
      azureAuthentication: {
        azuretokenresponse: state.azureAuthentication.azuretokenresponse,
        silentRequest: state.azureAuthentication.silentRequest,
        myInfo: state.azureAuthentication.myInfo,
        myPhoto: state.azureAuthentication.myPhoto,
        myPhotoMetaData: state.azureAuthentication.myPhotoMetaData,
      },
    };
  },
});

export default vuexPersist.plugin;
