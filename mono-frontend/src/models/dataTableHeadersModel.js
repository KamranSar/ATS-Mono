import DataTableHeader from '@/classes/DataTableHeader';

/**
 * @example
 *
 * const SOME_HEADERS = DataTableHeadersModel([
 * {
 *   text: 'Level',
 *   value: 'securityLevel',
 *   align: 'center',
 * },
 * {
 *   text: 'Endorsed To Program',
 *   value: 'endorsedProgram',
 *   formatter: function (item, value) {
 *     return item[value].toLowerCase() !== 'not applicable'
 *       ? item[value]
 *       : 'NA';
 *   },
 * },
 * {
 *   text: 'CDCR #',
 *   align: 'start',
 *   value: 'cdcrNumber',
 *   router: function (item, value) {
 *     return {
 *       name: 'Transfer Details',
 *       params: {
 *         cdcrNumber: item[value],
 *       },
 *       title: item[value],
 *     };
 *   },
 * }
 *
 * @param {Array<DataTableHeader>} headers See https://vuetifyjs.com/en/api/v-data-table/#props
 * @returns {Array<DataTableHeader>}
 */
function dataTableHeadersModel(headers = new Array()) {
  headers = headers.map((h) => new DataTableHeader(h));
  return headers;
}

export default dataTableHeadersModel;
