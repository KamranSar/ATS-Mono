import store from '@/store';

const azureTokenExpiration = () => {
  const token = store.get('azureAuthentication/azuretokenresponse');
  let expDate = null;
  if (!!token && !!token.expiresOn) {
    expDate = token.expiresOn;
    // console.log('\t\tAzure Token Expires At: ', expDate.toLocaleString());
  }

  if (expDate && expDate.getTime) {
    const now = Date.now();
    const minutes = 1; // Alert the user this many minutes before their session expires
    const newExpDate = new Date(expDate.getTime() - minutes * 60000);
    if (now >= newExpDate) {
      /* eslint-disable-next-line */
      console.log('azure token expired');
      return true;
    } else {
      return false;
    }
  } else {
    /* eslint-disable-next-line */
    console.log('azure token expired');
    return true;
  }
};

export default azureTokenExpiration;
