/**
 * This filter can be used in a <template></template>
 * to convert a readonly value to title case.
 *
 * @param {String} str A dash delimitted string
 * @param {String} delimitter Defaults to '-'; Splits the string based on the delimitter.
 * @returns A string split by it's delimitter and converted to title case.
 */
function toTitleCase(str, delimitter = '-') {
  str = str.toLowerCase().split(delimitter);
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

export default toTitleCase;
