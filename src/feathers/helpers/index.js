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
