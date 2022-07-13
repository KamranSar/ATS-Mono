import CdcrNumTableHeader from '@/classes/CdcrNumTableHeader';
import dataTableHeadersModel from '@/models/dataTableHeadersModel';

const DELETE_DIALOG = {
  DEFAULT: {
    title: 'Remove selected schedule',
    text: 'The schedule and ALL pertaining data will be removed from ATS.',
  },
  EXISTS: {
    title: 'Schedule contains endorsements',
    text: 'The schedule, endorsement records and ALL pertaining data will be removed from ATS.',
  },
  ENDORSEMENT: {
    title: 'Remove endorsement from schedule',
    text: 'Are you sure you want to remove this endorsement?',
  },
};

const headersSchedule = dataTableHeadersModel([
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
]);

const headersEndorsement = dataTableHeadersModel([
  new CdcrNumTableHeader(),
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  // { text: 'Housing', value: 'housing' },
  {
    text: 'Scheduled',
    value: 'isScheduled',
    formatter: function (item, value) {
      return item[value] ? 'Y' : 'N';
    },
  },
  { text: 'Transfer Reason', value: 'transferReasonCode' },
  { text: 'Endorsed To', value: 'endorsedToId' },
  { text: 'Endorsement Date', value: 'currentEndorsementDate' },
  { text: 'Expire Date', value: 'expirationEndorsementDate' },
  // { text: 'Endorsement Details', value: 'endorsementDetails' },
  { text: 'Print', value: 'print' },
  { text: 'Edit/Delete', value: 'actions', sortable: false },
]);
export { DELETE_DIALOG, headersSchedule, headersEndorsement };
