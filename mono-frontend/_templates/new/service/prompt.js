module.exports = [
  {
    type: 'input',
    name: 'name',
    message:
      'Feathers service name? (Ex: accountsbyapp, heartbeat, userprefs):',
    validate(value) {
      if (!value.length) {
        return 'Service name is required.';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'servicePath',
    initial: 'api/auth/v1/',
    message: 'Feathers service path? (Ex: api/auth/v1/userPrefs):',
  },
  {
    type: 'select',
    name: 'persisted',
    message: 'Create a vuex module around the service?',
    choices: [
      { message: 'No', title: 'No' },
      { message: 'Yes, but do not persist', title: 'None' },
      { message: 'Yes and persist with indexedDB', title: 'indexedDB' },
      { message: 'Yes and persist with localStorage', title: 'localStorage' },
      { message: 'Yes and persist with cookies', title: 'cookies' },
      {
        message: 'Yes and persist with sessionStorage',
        title: 'sessionStorage',
      },
    ],
  },
];
