import toTitleCase from '@/filters/toTitleCase.js';

/**
 * This config file is exposed by default as this.$myApp
 * Can also import myApp into a lib file like so:
 * import myApp from "@/config/myApp.js";
 */
var myApp = Object.freeze({
  // Name in package.json is used by default and added as an environment variable
  // The filter toTitleCase is used to convert the name, default delimitter is '-'.
  name: process.env.VUE_APP_NAME ? toTitleCase(process.env.VUE_APP_NAME) : '',
  version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'v???', // Update using `npm version major|minor|patch`
  gitID: process.env.VUE_APP_GIT_ID ? process.env.VUE_APP_GIT_ID : '1234567890',
  cdcrAppID: '12345', // TODO: Add client App ID given to you for your application
  approles: [
    // TODO: Add your application roles here
    /* {
      name: String,
      description: String
    } */
    {
      name: 'user-manager',
      description: 'Gives admin access to manager users in /users',
    },
    {
      name: 'admin',
      description: 'Generic application adminstrator',
    },
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
