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
  { text: 'Name', value: 'fullName' },
  { text: 'Schedule', value: 'title' },
  { text: 'Destination', value: 'destination' },
  { text: 'VIAs', value: 'vias' },
  { text: 'Transfer Reason', value: 'transferReasonCode' },
  { text: 'Transfer Date', value: 'transferDate' },
  { text: 'Endorsement Date', value: 'originalEndorsementDate' },
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
  { text: 'Name', value: 'fullName' },
  { text: 'Schedule', value: 'title' },
  { text: 'Transfer From', value: 'endorsedToId' },
  { text: 'VIAs', value: 'vias' },
  { text: 'Transfer Reason', value: 'transferReasonCode' },
  { text: 'Transfer Date', value: 'transferDate' },
  { text: 'Endorsement Date', value: 'originalEndorsementDate' },
  { text: 'Release Date', value: 'releaseDate' },
  { text: 'Print 135', value: 'preprint135' },
];

const DEPARTURES = 1;
const ARRIVALS = 2;

export { DEPARTURE_HEADERS, ARRIVAL_HEADERS, DEPARTURES, ARRIVALS };
