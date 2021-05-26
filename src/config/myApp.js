import defaultRoles from '@/config/private/acl/roles.js';
/**
 * This config file is exposed by default as this.$myApp
 * Can also import myApp into a lib file like so:
 * import myApp from "@/config/myApp.js";
 */
var myApp = Object.freeze({
  name: process.env.VUE_APP_NAME ? process.env.VUE_APP_NAME : '',
  version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'v???',
  gitID: process.env.VUE_APP_GIT_ID ? process.env.VUE_APP_GIT_ID : '1234567890',
  cdcrAppID: '12345', // TODO: Add client App ID given to you for your application
  approles: [
    // TODO: Add your application roles here
    /* {
      name: String,
      description: String
    } */
    ...defaultRoles,
    {
      name: 'example-role',
      description:
        'Generic application role, change this to suit your app needs',
    },
  ],
  helpers: {
    // reverseText: function (text) {
    //   return text.split('').reverse().join('');
    // },
  },
});

export default myApp;
