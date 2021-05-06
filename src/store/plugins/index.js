/**
 * Automatically imports all the plugins and exports as a single plugins array
 */
const requireModule = require.context('.', false, /\.js$/);
const plugins = [];
requireModule.keys().forEach((filename) => {
  // create the module name from fileName
  // remove the store.js extension and capitalize
  const pluginName = filename.replace(/(\.\/|\.js)/g, '');
  if (String(pluginName).toLowerCase() !== 'index') {
    plugins.push(
      requireModule(filename).default.plugin || requireModule(filename).plugin
    );
  }
});
// console.log('plugins: ', plugins);

export default plugins; // vuex plugins expects an array
