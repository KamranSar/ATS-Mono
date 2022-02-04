import { msalConfig } from '@/config/private/store/modules/azure/authConfig.js';

const clearMsalTokens = () => {
  if (msalConfig && msalConfig.auth && msalConfig.auth.clientId) {
    for (var key in localStorage) {
      if (key.includes(msalConfig.auth.clientId)) {
        localStorage.removeItem(key);
      }
    }
  }
};

export default clearMsalTokens;
