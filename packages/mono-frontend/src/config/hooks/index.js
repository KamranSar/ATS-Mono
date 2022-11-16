/**
 * ? What is this hooks folder: This folder contains hooks into all the lifecycle states of your application.
 * * onInit() - On refresh or during login
 * - You can define your init() functions inside each vuex module.
 * * onLogin() - After user signs in with Microsoft but before routing to Home
 * - Happens only AFTER the user explicitly logs in, not during a refresh of the browser
 * * resetState() - After authentication has been removed but before routing back to Login.
 * - You can define your resetState functions inside each vuex module.
 * * onLogout() - Called after user has been routed to the Login page after clicking 'Logout'

 */

// #region  BoilerPlate
const files = require.context('.', false, /\.js$/);
const h = {};
files.keys().forEach((filename) => {
  const helper = filename.replace(/(\.\/|\.js)/g, '');
  // console.log('helper: ', files(filename));
  if (files(filename).__esModule) {
    // ES Modules
    h[helper] = files(filename).default;
  } else if (files(filename) && files(filename)[helper]) {
    // Common JS
    h[helper] = files(filename)[helper];
  }
});

module.exports = {
  ...h,
};
// #endregion BoilerPlate
