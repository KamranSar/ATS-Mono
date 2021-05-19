var myApp = Object.freeze({
  name: process.env.VUE_APP_NAME ? process.env.VUE_APP_NAME : '',
  version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'v???',
  gitId: process.env.VUE_APP_GIT_ID ? process.env.VUE_APP_GIT_ID : '1234567890',
  cdcrAppID: '12345', // TODO: Add client App ID given to you for your application
  approles: [
    /* {
      name: String,
      description: String
    } */
    {
      name: 'user-admin',
      description: 'Gives admin access to manager users in /admin/users',
    },
    {
      name: 'admin',
      description: 'Generic application adminstrator',
    },
  ], // TODO: Developer defined user application roles
  helpers: {
    // reverseText: function (text) {
    //   return text.split('').reverse().join('');
    // },
  },
});

export default myApp;
