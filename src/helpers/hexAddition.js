/**
 * * NOTE: This helper is written as a commonjs module because it was originally for vue.config.js
 *
 * This helper is used to perform addition between two hexadecimal numbers
 * This helper DOES NOT handle negative values
 *
 * @param {String} hex1 - A string representing the hex1 value
 * @param {String} hex2 - A string representing the hex2 value
 * @returns {String} Returns the sum of the two hexadecimal numbers.
 */
function hexAddition(hex1, hex2) {
  if (hex1.charAt(0) === '#') {
    hex1 = hex1.slice(1);
  }
  if (hex2.charAt(0) === '#') {
    hex2 = hex2.slice(1);
  }

  // Parse to base16
  var hexStr = (parseInt(hex1, 16) + parseInt(hex2, 16)).toString(16);
  while (hexStr.length < 6) {
    hexStr = '0' + hexStr;
  } // Zero pad.
  return hexStr;
}

module.exports = {
  hexAddition,
};
