/**
 * This filter can be used in a <template></template>
 * to convert a readonly value to title case.
 * @example
 *  <span>{{toTitleCase($myApp.name)}}</span>
 *
 * OR
 *
 * @example
 *  <span>{{$myApp.name}} | toTitleCase</span>
 *
 * @param {String} str A dash delimitted string
 * @returns A string converted to TitleCase base on whitespace and other common delimitters: -, /
 */
function toTitleCase(str) {
  const matchDelimitters = /(^|\s|-|\/)/;
  const matchFirstChar = /(^|\s|-|\/)\S/;
  return str
    .toLowerCase()
    .replace(RegExp(matchFirstChar, 'gm'), (t) => t.toUpperCase())
    .replace(RegExp(matchDelimitters, 'gm'), ' ');
}

export default toTitleCase;
