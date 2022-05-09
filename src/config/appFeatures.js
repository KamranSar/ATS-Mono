/**
 * This file defines all of the application features available for use.
 * These feature flags would be seperate from darkMode or grid preferences
 *
 * * Theoretically you could import loggedInUser & appUserRoles from vuex into this file
 * * to enable feature flags based on user.
 */

const LEFT_DRAW_ENABLED = true; // This feature flag is captures in App.vue and AppBar.vue
const RIGHT_DRAW_ENABLED = false; // This feature flag is captures in App.vue and AppBar.vue
const BOTTOM_BAR_ENABLED = true; // This feature flag is captures in App.vue
const WEB_SOCKETS_ENABLED = false; // Set to true to switch from REST to Web Sockets
const MULTIPLE_USER_ROLES_ENABLED = false; // This feature flag allows assigning multiple roles to a user.
const TOS_ENABLED = true; // This flag ensures the users agrees to your TOS before logging in. (See @/config/TermsAndConditions.js)
const SHOW_SIGNUP_URL_ENABLED = true && 'https://account.microsoft.com/account'; // Displays the label with a hyperlink to this URL on Login.
const SHOW_SIGNUP_LABEL = 'No account? Register here...';

/**
 * The flag, CLIENT_ROLES_ENABLED is used for backwards compatibility between applications
 * that have their roles defined in the code base vs in the MT.
 *
 * @deprecated >v0.6.0 vue-frontend-template
 */
const CLIENT_ROLES_ENABLED = true; // This will be deprecated when the MT moved to server side roles

/**
 * If the loggedInUser has access to the user management page...
 * this flag only allows them to manage users from their own institution.
 */
const MANAGE_BY_INSTITUTION_ENABLED = true;

/**
 * !FOR TESTING PURPOSES ONLY
 * */
const FAKE_ROLES_ENABLED = true && ['Institution Administrator']; // Set to true to add these roles to getNewToken for the loggedInUser

/**
 * !FOR TESTING PURPOSES ONLY
 * This does NOT change the organizationId or organizationType on `loggedInuser.somsinfo`
 */
const FAKE_INSTITUTION_ENABLED =
  true && 'California Health Care Facility - Stockton'; // Set to true to to change your `organizationName` in `loggedInUser`.
export {
  LEFT_DRAW_ENABLED,
  RIGHT_DRAW_ENABLED,
  BOTTOM_BAR_ENABLED,
  WEB_SOCKETS_ENABLED,
  MULTIPLE_USER_ROLES_ENABLED,
  TOS_ENABLED,
  SHOW_SIGNUP_URL_ENABLED,
  SHOW_SIGNUP_LABEL,
  CLIENT_ROLES_ENABLED,
  MANAGE_BY_INSTITUTION_ENABLED,
  FAKE_ROLES_ENABLED,
  FAKE_INSTITUTION_ENABLED,
};
