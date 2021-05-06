/**
 * Automatically imports all the sercices and exports as a single services array
 */
const requireModule = require.context('.', false, /\.js$/);
const services = [];
requireModule.keys().forEach((filename) => {
  // create the module name from fileName
  // remove the store.js extension and capitalize
  const pluginName = filename.replace(/(\.\/|\.js)/g, '');
  if (String(pluginName).toLowerCase() !== 'index') {
    services.push(requireModule(filename).default || requireModule(filename));
  }
});
// console.log("Services: ", services)

export default services; // vuex plugins expects an array
