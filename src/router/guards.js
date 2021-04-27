import store from '@/store/index';

function requireToken(to, from, next) {
  const token = store.get('azureAuthentication/azuretokenresponse');
  if (token) next();
  else next({ name: 'home' });
}

function requireAuth(to, from, next) {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) next();
  else next({ name: 'login' });
}

function dynamicHome(to, from, next) {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) next({ name: 'Dashboard' });
  else next();
}

function dynamicLogin(to, from, next) {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
}

async function logout(to, from, next) {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) {
    try {
      const feathersLoggedIn = store.get(
        'feathersAuthentication/isAuthenticated'
      );
      if (feathersLoggedIn) {
        await store.dispatch('feathersAuthentication/logout', {
          strategy: 'jwt',
        }); // log out of Feathers. Removes the local jwt and calls the api server to log out
        // If the JWT has already expired, we will get a 401 or 403 error back from the server which is OK.
        // We disable the ability to renew (or delete) JWT's this way.  We can only call the POST (authenticate)
        // method now for security reasons.
        console.log('successfully logged out of api server');
      }
    } catch (e) {
      console.log(e);
    }

    try {
      await store.dispatch('azureAuthentication/logout'); // And always remove the Azure login token.
      await store.commit('users/clearAll');
    } catch (e) {
      console.log(e);
    }
  }
  next({ name: 'login' });
}

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let previouslyRestored = false;
const waitForStorageToBeReady = async (to, from, next) => {
  try {
    await Promise.all(store.restored); // Set by VuexPersist
    if (!previouslyRestored) {
      // TODO: Add your custom initialization code here : do the things you want to do only once after the store is restored
      // await delay(500); // As an example
      previouslyRestored = true;
    }
  } catch (e) {
    previouslyRestored = true;
  }
  next();
};

export {
  requireToken,
  requireAuth,
  dynamicHome,
  dynamicLogin,
  logout,
  waitForStorageToBeReady,
};
