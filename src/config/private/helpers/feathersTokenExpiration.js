import store from '@/store';

const feathersTokenExpiration = () => {
  // Grab token expiration from authentication in users modules
  const authentication = store.get('users/authentication');
  const hasToken =
    authentication && authentication.payload && authentication.payload.exp;

  // If user still has a token, check it isnt' nearing expiration
  console.log('hasToken: ', hasToken);
  if (hasToken) {
    const ExpiresAt = new Date(hasToken * 1000);
    console.log(ExpiresAt.toLocaleString());

    const now = new Date();
    const minutes = 1; // Alert the user this many minutes before their session expires
    const newExpDate = new Date(ExpiresAt.getTime() - minutes * 60000);
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
