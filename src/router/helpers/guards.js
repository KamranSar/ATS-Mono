// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
import store from '@/store/index';

const requireToken = (to, from, next) => {
  const token = store.get('azureAuthentication/azuretokenresponse');
  if (token) next();
  else next({ name: 'Login' });
};

const requireAuth = (to, from, next) => {
  const loggedIn = store.get('azureAuthentication/isAzureLoggedIn');
  if (loggedIn) next();
  else next({ name: 'Login' });
};

const requireRoleAdmin = (to, from, next) => {
  const user = store.get('feathersAuthentication/user');
  if (user && String(user.role).toLowerCase() === 'admin') next();
  else next({ path: '/404' });
};

let previouslyRestored = false;
const waitForStorageToBeReady = async (to, from, next) => {
  try {
    await Promise.all(store.restored); // Set by VuexPersist
    if (!previouslyRestored) {
      // TODO: Add your custom initialization code here : do the things you want to do only once after the store is restored
      previouslyRestored = true;
    }
  } catch (e) {
    previouslyRestored = true;
  }
  next();
};

export { requireToken, requireAuth, requireRoleAdmin, waitForStorageToBeReady };
