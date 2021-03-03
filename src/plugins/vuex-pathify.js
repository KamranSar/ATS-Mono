import pathify from 'vuex-pathify';

// https://davestewart.github.io/vuex-pathify/#/?id=home
// https://davestewart.github.io/vuex-pathify/#/setup/mapping
// options
//pathify.options.mapping = 'standard'; // Make all Mutations SET_VARIABLE_NAME
pathify.options.mapping = 'simple'; // keep mutation names the same as the variable name
pathify.options.deep = 2;
pathify.options.strict = true;
if (process.env.NODE_ENV === 'development') {
  pathify.debug(); // Print out pathify's settings
}
export default pathify;
