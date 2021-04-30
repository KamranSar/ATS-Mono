import VuexPersistence from '@/../local_modules/vuex-persist';
import localForage from 'localforage';
import { servicePath as usersServicePath } from '@/store/services/Users';

// https://localforage.github.io/localForage/#multiple-instances-createinstance
const localForageInstance = localForage.createInstance({
  name: 'appDatabase', // database name
  storeName: 'azureInfo', // table name
});

const modules = [
  'azureAuthentication',
  'feathersAuthentication',
  usersServicePath,
]; // Modules you want to save to persistence

const vuexPersist = new VuexPersistence({
  key: 'azureFields', // The key to store the state on in the storage provider.
  storage: localForageInstance, // or window.sessionStorage, window.localStorage, or localForage
  asyncStorage: true, // needed for localforage
  restoreState: (key) => {
    localForageInstance.getItem(key).then((state) => {
      // You can manipulate the state here before it is restored - such as decrypt certain keys
      // console.log(state);
      return state;
    });
    return localForageInstance.getItem(key);
  },
  saveState: (key, state) => {
    // You can manipulate the state here before it goes into the database - such as encrypt certain keys
    // console.log(key, state);
    return localForageInstance.setItem(key, state);
  },
  // only save these fields from the state
  reducer: (state) => {
    // Your reducer should not change the shape of the state.
    // https://github.com/championswimmer/vuex-persist#reducer
    // console.dir(state);
    return {
      azureAuthentication: {
        azuretokenresponse: state.azureAuthentication.azuretokenresponse,
        myInfo: state.azureAuthentication.myInfo,
        myPhoto: state.azureAuthentication.myPhoto,
        myPhotoMetaData: state.azureAuthentication.myPhotoMetaData,
      },
      feathersAuthentication: {
        accessToken: state.feathersAuthentication.accessToken,
        payload: state.feathersAuthentication.payload,
        user: state.feathersAuthentication.user,
      },
      [usersServicePath]: state[usersServicePath],
    };
  },
  filter: (mutation) => {
    return !modules.every((name) => {
      return !mutation.type.includes(name + '/');
    });
  },
});

export default vuexPersist;
