const ENDORSEMENT_HEADERS = [
  {
    text: 'CDCR #',
    align: 'start',
    value: 'cdcrNumber',
  },
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  { text: 'Level', value: 'securityLevel' },
  { text: 'Endorsed To-Level(Program)', value: 'endorsedTo' },
  { text: 'Endorsed Date', value: 'endorsedDate' },
  { text: 'Expired Date', value: 'expirationDate' },
  { text: 'Release Date', value: 'releaseDate' },
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
