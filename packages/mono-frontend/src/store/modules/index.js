/** @/store/modules/index.js
 * NOTE: This file exports all modules within @/store/modules/.
 * This also includes any immediate child directories with a file called index.js
 * The module name for will be the name of the folder.
 *
 * NOTE: This automated export will ignore any folders within the parent.
 * Ex. @/store/modules/userPrefs/userPrefsChild/index.js is ignored
 */

// Import module files within @/store/modules/.
let requireModules = require.context('.', false, /\.js$/);
const modules = {};
requireModules.keys().forEach((filename) => {
  // create the module name from fileName
  // remove the store.js extension and capitalize
  const moduleName = filename.replace(/(\.\/|\.js)/g, '');
  // .replace(/^\w/, (c) => c.toUpperCase());
  if (requireModules(filename) && 'default' in requireModules(filename)) {
    modules[moduleName] = requireModules(filename).default;
  }
});

// Import modules folders within @/store/modules/.
requireModules = require.context('.', true, /\/\w+\/?index.js/);
requireModules.keys().forEach((folderPath) => {
  // console.log('folderPath: ', folderPath);
  // Set the module name to the folder name
  // Match only on the first level of the directory
  // where the first directory level has an index.js file
  const regExpMatch = folderPath.match(/^(.\/)(\w*)(\/index\.js)/);
  if (regExpMatch && regExpMatch.length > 2 && regExpMatch[2]) {
    const folderName = regExpMatch[2];
    modules[folderName] =
      requireModules(folderPath).default || requireModules(folderPath);
    // console.log(`${folderName}: `, modules[folderName]);
  }
});

delete modules['Index']; // Index comes by default but not needed for import
// console.log('modules: ', modules);

export default modules;
