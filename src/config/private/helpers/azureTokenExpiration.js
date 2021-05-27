import store from '@/store';

const azureTokenExpiration = () => {
  const token = store.get('azureAuthentication/azuretokenresponse');
  const hasToken = !!token && !!token.expiresOn;
  let expDate = null;
  if (hasToken) {
    const ExpiresAt = token.expiresOn;
    // console.log(ExpiresAt.toLocaleString());
    expDate = ExpiresAt;
  }

  if (expDate) {
    const now = new Date();
    const minutes = 1; // Alert the user this many minutes before their session expires
    const newExpDate = new Date(expDate.getTime() - minutes * 60000);
    if (now >= newExpDate) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export default azureTokenExpiration;
