import pathify from 'vuex-pathify';
export default pathify;

// https://davestewart.github.io/vuex-pathify/#/?id=home
// https://davestewart.github.io/vuex-pathify/#/setup/mapping
// options
pathify.options.mapping = 'standard';
pathify.options.deep = 2;
if (process.env.NODE_ENV === 'development') {
  pathify.debug(); // Print out pathify's settings
}
