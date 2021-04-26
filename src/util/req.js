/**
 * Generic axios configuration to simplify Web Services.
 * 
 * Example:
  const { getData } = await req('get', 'v0/get-profile/', state.user);
  const { postData } = await req('post', 'v0/auth/login', {
    userid: state.registerUserId,
    password: state.registerPass,
  });
 */
import axios from 'axios';
import store from '@/store/index';

async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
    // const retval = await response.json();
    // return retval;
  } catch (e) {
    return null;
  }
}
export { fetchWithTimeout };

export default async (reqType, reqURL, data) => {
  store.set('app/loading', true);
  store.commit('alert/setAlertMsg', '');

  const options = {
    headers: {
      Authorization: `Bearer ${store.state.authentication.token}`,
    },
  };

  try {
    switch (reqType) {
      case 'post':
        return await axios.post(
          store.state.baseURL + '/' + reqURL,
          data,
          options
        );

      case 'patch':
        return await axios.patch(
          store.state.baseURL + '/' + reqURL,
          data,
          options
        );

      case 'get':
        return await axios.get(store.state.baseURL + '/' + reqURL, options);
    }
  } catch (e) {
    const msgPrefix = ['post', 'patch'].includes(reqType)
      ? `Error saving data. `
      : `Error fetching details. `;

    const err =
      (e['response'] &&
        e['response']['data'] &&
        (e['response']['data']['error'] || e['response']['data'])) ||
      '';

    let errMsg = err['message'] ? err['message'] : err;
    if (
      err &&
      err['message'] &&
      err['message'].includes('E_JWT_TOKEN_EXPIRED')
    ) {
      errMsg = 'Your session has expired. Re-login to continue.';
      store.commit('authentication/logout');
    }

    store.commit('alert/setAlertMsg', `${msgPrefix} ${errMsg}`);

    // stop further processing in caller!
  } finally {
    store.set('app/loading', false);
  }
};
