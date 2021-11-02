/**
 * ? What is this file: This file contains the BoilerPlate code to make exporting our helper files easier
 *
 * ! CAVEATS: This does not work outside of webpack.
 *
 * * HOW TO USE:
 * * 1. Save a copy of the BoilerPlate in this file as the index.js to any other "helpers-like" folder.
 * * 2. All files within that folder will `export default` at a minimum. "SEE EXAMPLE FILE" below.
 * * 3. The end result can be seen in the "EXAMPLE USAGE" below
 *
 * 1. EXAMPLE FILE STRUCTURE: /apis
 * /apis
 *  /index.js
 *  /getHeartbeat.js
 *  /getInstitutions.js
 *  /getDropdownLists.js
 *  /helloWorld.js
 *
 * 2. EXAMPLE FILE: helloWorld.js
 * const helloWorld = function () { console.log("Hello World!"); }
 * const helloEarthling = function () { console.log("Hello Earthling"); }
 * export { helloWorld, helloEarthling }
 * export default helloWorld
 *
 * 3. EXAMPLE USAGE: Home.vue
 * <script>
 * import { helloWorld, getHeartBeat, getDropdownLists } from '@/apis/index.js';
 * import { helloEarthling } from "@/apis/helloWorld.js";
 * export default { mounted() { helloWorld(); helloEarthling(); } }
 * </script>
 *
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
