/**
 * These headers are used within the table in the Home route
 *
 * https://vuetifyjs.com/en/api/v-data-table/#props-headers
 */

const DEPARTURE_HEADERS = [
  {
    text: 'CDCR Number',
    align: 'start',
    value: 'cdcrNumber',
  },
  { text: 'Schedule', value: 'title' },
  { text: 'Name', value: 'fullName' },
  { text: 'Destination', value: 'destination' },
  { text: 'VIAs', value: 'vias' },
  { text: 'Transfer Reason', value: 'transferReasonCode' },
  { text: 'Endorsement Date', value: 'transferDate' },
  { text: 'Release Date', value: 'releaseDate' },
  { text: 'Print 135', value: 'print135' },
  // { text: 'Updates?', value: 'updates' },
];

const ARRIVAL_HEADERS = [
  {
    text: 'CDCR Number',
    align: 'start',
    value: 'cdcrNumber',
  },
  { text: 'Schedule', value: 'title' },
  { text: 'Name', value: 'fullName' },
  { text: 'Transfer From', value: 'origin' },
  { text: 'VIAs', value: 'vias' },
  { text: 'Transfer Reason', value: 'transferReasonCode' },
  { text: 'Endorsement Date', value: 'transferDate' },
  { text: 'Release Date', value: 'releaseDate' },
  { text: 'Print 135', value: 'preprint135' },
];

export { DEPARTURE_HEADERS, ARRIVAL_HEADERS };
