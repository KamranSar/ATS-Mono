const themes = Object.freeze({
  light: {
    primary: '#1976D2', // Blue
    secondary: '#424242', // Dark Grey
    accent: '#82B1FF', // Light-Blue
    error: '#FF5252', // Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FFC107', // Yellow
  },
  dark: {},
});

// This file gets imported into vue.config.js.
// vue.config.js does not support ES Modules.
module.exports = {
  themes,
};
