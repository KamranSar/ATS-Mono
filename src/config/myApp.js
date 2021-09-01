import toTitleCase from '@/helpers/toTitleCase.js';

const isLcl = window.location.hostname.includes('localhost'); // (internal only)
const isDev = window.location.hostname.includes('dev'); // (internal only)
const isTst = window.location.hostname.includes('test'); // (internal and external/public)
const isPoc = window.location.hostname.includes('poc'); // (internal and external/public)

// TODO: Define a default role for the first logged in user.
const defaultAdminRole = {
  name: 'System Administrator',
  description: 'Gives access to manage users in the application',
  priority: 1, // Default: 1 - Highest priority level
};

const appVersion = process.env.VUE_APP_VERSION
  ? 'v' + process.env.VUE_APP_VERSION
  : 'v???';
const gitVersion = process.env.VUE_APP_GIT_RAW
  ? appVersion + '.' + process.env.VUE_APP_GIT_RAW
  : '';

/**
 * This config file is exposed by default as this.$myApp
 * Can also import myApp into a lib file like so:
 * import myApp from "@/config/myApp.js";
 */
var myApp = Object.freeze({
  // Name in package.json is used by default and added as an environment variable
  // The filter toTitleCase is used to convert the name, default delimitter is '-'.
  name: process.env.VUE_APP_NAME ? toTitleCase(process.env.VUE_APP_NAME) : '',
  appVersion, // Update using `npm version major|minor|patch`
  gitVersion,
  cdcrAppID: process.env.VUE_APP_CDCR_APP_ID, // TODO: Request your cdcrAppID from dashboard
  publicPath: process.env.VUE_APP_PUBLIC_PATH, // TODO: Define the publicPath in package.json
  useWebSocketConnection: false, // Set to true to switch from REST to Web Sockets
  appType: 'PWA',
  isLcl,
  isDev,
  isTst,
  isPoc,
  isPrd: !isLcl && !isDev && !isTst, // (internal only until Tim updates the VIP route) TODO: Nurthin Aziz 2021-07-22 UPDATE THIS COMMENT.
  allowMultipleRoles: false, // This flag allows assigning multiple roles to a user.
  approles: [
    // TODO: Add your application roles here
    /* {
      name: String,
      description: String,
      priority: Number, // Default: 1 - Highest priority level; NOTE: Cannot assign roles of a higher priority level than your own
    } */
    defaultAdminRole,
    {
      name: 'Example Role',
      description:
        'Generic application role, change this to suit your app needs',
      priority: 999,
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
