import toTitleCase from '@/filters/toTitleCase.js';

// TODO: Define a default role for the first logged in user.
const defaultAdminRole = {
  name: 'System Administrator',
  description: 'Gives access to manage users in the application',
};

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
  azureAppID: 'c0cf535a-bb4d-4731-94fb-8a4165b1a124', // This is your azure app id requested from Network Engr
  cdcrAppID: '12345', // TODO: Add client App ID given to you for your application
  publicPath: process.env.VUE_APP_PUBLIC_PATH, // TODO: Define the publicPath in package.json
  useWebSocketConnection: true, // Set to True to switch from REST to Web Sockets
  approles: [
    // TODO: Add your application roles here
    /* {
      name: String,
      description: String
    } */
    defaultAdminRole,
    {
      name: 'Example Role',
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

export { defaultAdminRole, myApp };
