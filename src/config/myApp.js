var myApp = Object.freeze({
  name: process.env.VUE_APP_NAME ? process.env.VUE_APP_NAME : '',
  version: process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'v???',
  gitid: process.env.VUE_APP_GIT_ID ? process.env.VUE_APP_GIT_ID : '1234567890',
  helpers: {
    // reverseText: function (text) {
    //   return text.split('').reverse().join('');
    // },
  },
});

export default myApp;
