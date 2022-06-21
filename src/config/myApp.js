import toTitleCase from '@cdcr/vue-frontend/helpers/toTitleCase.js';
import { SYS_ADMIN, INST_ADMIN, INST_USER, GUEST } from '@/helpers/appRoles.js';

const isLcl = window.location.hostname.includes('localhost'); // (internal only)
const isDev = window.location.hostname.includes('dev'); // (internal only)
const isTst = window.location.hostname.includes('test'); // (internal and external/public)
const isPoc = window.location.hostname.includes('poc'); // (internal and external/public)

/**
 * The object, defaultAdminRole is used in conjunction with the appFeature CLIENT_ROLES_ENABLED.
 *
 * @deprecated >v0.6.0 vue-frontend-template
 * Be sure to remove all references after CLIENT_ROLES_ENABLED is set to false.
 *
 * TODO: Define a default role for the first logged in user.
 */
const defaultAdminRole = SYS_ADMIN;

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
  appType: 'PWA',
  isLcl,
  isDev,
  isTst,
  isPoc,
  isPrd: !isLcl && !isDev && !isTst,
  isMobile:
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
  approles: [defaultAdminRole, INST_ADMIN, INST_USER, GUEST],
  appServers: ['ats'],
});

export default myApp;

export { defaultAdminRole, myApp };
