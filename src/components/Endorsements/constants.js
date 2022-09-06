import { LOADING_TEXT } from '@/helpers/tables.js';
import DataTableHeadersModel from '@/models/dataTableHeadersModel.js';
import CdcrNumTableHeader from '@/classes/CdcrNumTableHeader';
import formatDate from '@/helpers/formatDate.js';
import { CASE_FACTORS } from '@/helpers/formatCaseFactors';

/**
 * This helper is private to the Endorsements page as there are only 4 fields that show their prefixes.
 *
 * @param {SomsOffender} item
 * @returns {String} Concatenated string of case factors
 */
const _formatCaseFactors = function (item) {
  const cf = [];
  // eslint-disable-next-line no-unused-vars
  const PREFIXED_CF = [
    CASE_FACTORS.cocci1_flag,
    CASE_FACTORS.cocci2_flag,
    CASE_FACTORS.ice_flag,
  ];

  Object.keys(CASE_FACTORS).forEach((key) => {
    if (key in item) {
      // If flag then push the value
      if (item[key]) {
        let caseFactorValue = item[CASE_FACTORS[key].value];
        // if (key in Object.keys(PREFIXED_CF)) {
        if (item[CASE_FACTORS[key].value] === 'Y') {
          caseFactorValue = `${CASE_FACTORS[key].prefix} ${
            item[CASE_FACTORS[key].value]
          }`;
        }

        cf.push(caseFactorValue);
      }
    }
  });
  return cf.join(', ');
};

const ENDORSEMENT_HEADERS = DataTableHeadersModel([
  { text: 'Saved', value: 'saved' },
  new CdcrNumTableHeader(),
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  {
    text: 'Endorsed Institution',
    value: 'endorsedInstitution',
  },
  {
    text: 'Level',
    value: 'securityLevel',
    align: 'center',
  },
  {
    text: 'Endorsed To Program',
    value: 'endorsedProgram',
    formatter: function (item, value) {
      return item[value].toLowerCase() !== 'not applicable'
        ? item[value]
        : 'NA';
    },
  },
  {
    text: 'Endorsed Date',
    value: 'endorsedDate',
    classList: ['nowrap'],
    formatter: function (item, value) {
      return formatDate(item[value]);
    },
  },
  {
    text: 'Expired Date',
    value: 'expirationDate',
    classList: ['nowrap'],
    formatter: function (item, value) {
      return formatDate(item[value]);
    },
  },
  {
    text: 'Release Date',
    value: 'releaseDate',
    classList: ['nowrap'],
    formatter: function (item, value) {
      return formatDate(item[value]);
    },
  },
  {
    text: 'Case Factor',
    value: 'caseFactor',
    formatter: function (item) {
      return _formatCaseFactors(item);
    },
  },
  { text: 'Ethnicity', value: 'ethnicity' },
  { text: 'Housing', value: 'housingArea' },
  { text: 'Bed', value: 'bed' },
  { text: 'In House Remarks', value: 'inHouseRemarks' },
]);

const ENDORSEMENT_OPTIONS = {
  // page: number,
  itemsPerPage: 10,
  sortBy: ['endorsedDate'],
  // sortDesc: boolean[],
  // groupBy: string[],
  // groupDesc: boolean[],
  // multiSort: boolean,
  // mustSort: boolean
};

const NO_DATA_TEXT = 'No Endorsements';

const NO_RESULTS_TEXT = 'No Endorsements Found';

export {
  ENDORSEMENT_HEADERS,
  ENDORSEMENT_OPTIONS,
  NO_DATA_TEXT,
  NO_RESULTS_TEXT,
  LOADING_TEXT,
};
