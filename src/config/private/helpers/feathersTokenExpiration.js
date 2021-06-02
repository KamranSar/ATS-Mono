import feathers from '@/config/private/feathers';
import jwt_decode from 'jwt-decode';

const feathersTokenExpiration = () => {
  // Grab token expiration from authentication in users modules
  const encodedToken =
    feathers.authentication.options.storage[
      feathers.authentication.options.storageKey
    ] || null;
  const decodedToken = encodedToken ? jwt_decode(encodedToken) : {};

  // If user still has a token, check it isnt' nearing expiration
  if (decodedToken && decodedToken.exp) {
    const expDate = new Date(decodedToken.exp * 1000);
    // console.log('\t\tFeathers Token Expires At: ', expDate.toLocaleString());

    const now = new Date();
    const minutes = 1; // Alert the user this many minutes before their session expires
    const newExpDate = new Date(expDate.getTime() - minutes * 60000);

    // If current time has passed expiration date
    // Return true for expired
    if (now >= newExpDate) {
      return true;
    } else {
      return false;
    }
  } else {
    return true; // Assume token has expired if no token
  }
};

export default feathersTokenExpiration;
