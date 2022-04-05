const headersSchedule = [
  { text: 'Schedule', value: 'title' },
  {
    text: 'Destination',
    align: 'start',
    sortable: false,
    value: 'destination',
  },
  { text: 'via', value: 'vias' },
  // { text: 'via 2', value: 'via' },
  { text: 'Transfer Date', value: 'transferDate' },
  { text: 'Seats', value: 'seats' },
  // { text: 'Remaining Seats', value: 'remainingSeats' },
  { text: 'Print-135', value: 'print135' },
  { text: 'Edit/Delete', value: 'actions', sortable: false },
];
const headersEndorsement = [
  {
    text: 'CDCR Number',
    align: 'start',
    sortable: false,
    value: 'cdcrNumber',
  },
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  // { text: 'Housing', value: 'housing' },
  { text: 'Scheduled', value: 'isScheduled' },
  { text: 'Transfer Reason', value: 'transferReasonCode' },
  { text: 'Endorsement Date', value: 'currentEndorsementDate' },
  { text: 'Expire Date', value: 'expirationEndorsementDate' },
  // { text: 'Endorsement Details', value: 'endorsementDetails' },
  { text: 'Print', value: 'print' },
  { text: 'Edit/Delete', value: 'actions', sortable: false },
];
export { headersSchedule, headersEndorsement };
