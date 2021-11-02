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

export {
  LEFT_DRAW_ENABLED,
  RIGHT_DRAW_ENABLED,
  BOTTOM_BAR_ENABLED,
  WEB_SOCKETS_ENABLED,
  MULTIPLE_USER_ROLES_ENABLED,
};
