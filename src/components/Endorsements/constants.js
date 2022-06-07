const ENDORSEMENT_HEADERS = [
  {
    text: 'CDCR #',
    align: 'start',
    value: 'cdcrNumber',
  },
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  { text: 'Endorsed Institution', value: 'endorsedInstitution' },
  { text: 'Level', value: 'securityLevel', align: 'center' },
  { text: 'Endorsed To Program', value: 'endorsedProgram' },
  { text: 'Endorsed Date', value: 'endorsedDate', align: 'center' },
  { text: 'Expired Date', value: 'expirationDate', align: 'center' },
  { text: 'Release Date', value: 'releaseDate', align: 'center' },
  { text: 'Case Factor', value: 'caseFactor' },
  { text: 'Ethnicity', value: 'ethnicity' },
  { text: 'Housing', value: 'housingArea' },
  { text: 'In House Remarks', value: 'inHouseRemarks' },
];

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
export { ENDORSEMENT_HEADERS, ENDORSEMENT_OPTIONS };
