import feathers from '@/feathers/index.js';
import jwt_decode from 'jwt-decode';

const feathersTokenExpiration = () => {
  // Grab token expiration from authentication in users modules
  let retval = true;
  if (
    feathers.authentication &&
    feathers.authentication.options.storage &&
    feathers.authentication.options.storageKey
  ) {
    if (!feathers.authentication.authenticated) {
      console.log('Not authenticated so get a feathers new token');
      return true; // If not authenticated, treat as expired
    }
    const encodedToken =
      feathers.authentication.options.storage[
        feathers.authentication.options.storageKey
      ] || null;
    const decodedToken = encodedToken ? jwt_decode(encodedToken) : {};

    // If user still has a token, check it isnt' nearing expiration
    if (decodedToken && decodedToken.exp) {
      const expDate = new Date(decodedToken.exp * 1000);
      console.log('\t\tFeathers Token Expires At: ', expDate.toLocaleString());

      const now = new Date();
      const minutes = 1; // Alert the user this many minutes before their session expires
      const newExpDate = new Date(expDate.getTime() - minutes * 60000);

      // If current time has passed expiration date
      // Return true for expired
      if (now >= newExpDate) {
        retval = true;
      } else {
        retval = false;
      }
    }
  } else {
    console.error('Feathers authentication not configured');
  }
  return retval;
};

export default feathersTokenExpiration;
