/**
 * This function takes in a string value and formats the value directly into upper case.
 * If the value passed in is not a typeof `string` then the function does nothing.
 *
 * This function is helper for inputs that have the `clearable` attribute that set value to null on clear.
 * @param {String} value
 */
const onToUpperCase = (value) => {
  if (typeof value === 'string') {
    value = value.toUpperCase();
  }
};

export default onToUpperCase;
