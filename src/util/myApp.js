var myApp = Object.freeze({
  name: process.env.VUE_APP_NAME,
  version: process.env.VUE_APP_VERSION,
  helpers: {
    // reverseText: function (text) {
    //   return text.split('').reverse().join('');
    // },
  },
});

export default myApp;
