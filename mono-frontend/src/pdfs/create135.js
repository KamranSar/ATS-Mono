/**
 * This pdf document prints the Transfer Record given a schedule and an array of transfers.
 *
 * create135() creates the documentDefinition object that gets passed into pdfMake.createPdf(...).download(...)
 * https://pdfmake.github.io/docs/0.1/document-definition-object/
 *
 * The styles, header, footer, and content are generated from helper functions
 */

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import store from '@/store/';

const _ddTransferRecordStyle = () => {
  return {
    hdrLeft: {
      bold: true,
      fontSize: 7,
    },
    hdrRight: {
      alignment: 'right',
      bold: true,
      fontSize: 8,
    },
    hdrSchedule: {
      bold: true,
      fontSize: 8,
    },
    tblHeader: {
      bold: true,
      fontSize: 8,
      color: 'black',
    },
    tblData: {
      fontSize: 9,
    },
    tblCenter: {
      alignment: 'center',
      bold: true,
      fontSize: 10,
    },
  };
};

const _ddTransferRecordHeader = (selSchedule, transferNumber) => {
  // Row 1
  const DOC_TITLE = 'STATE OF CALIFORNIA';
  const REPORT_NAME = 'CDCR 135 (Rev. 03/06)';
  const DISTRIBUTION_POLICY = 'DISTRIBUTION PER INSTITUTION POLICY';
  const REPORT_TITLE = 'TRANSFER RECORD';
  const AGENCY = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
  const ROW_1 = [
    {
      text: `${DOC_TITLE}\n${REPORT_NAME}\n${DISTRIBUTION_POLICY}`,
      style: 'hdrLeft',
      border: [true, true, false, true], // Left, top, right, bottom
    },
    {
      text: REPORT_TITLE,
      style: 'tblCenter',
      border: [false, true, false, true],
    },
    {
      text: AGENCY,
      style: 'hdrRight',
      border: [false, true, true, true],
    },
  ];

  // Row 2
  const TRANSFER_DATE_LABEL =
    'The following identifed persons will be transferred this date';
  const TRANSFER_DATE_VALUE = `DATE: ${selSchedule.transferDate}`;
  const TRANSFER_NUMBER_VALUE = `NUMBER TRANSFERRING: ${transferNumber}`;
  const ROW_2 = [
    {
      text: TRANSFER_DATE_LABEL,
      style: 'hdrSchedule',
      border: [true, true, false, true],
    },
    {
      text: TRANSFER_DATE_VALUE,
      style: 'hdrSchedule',
      border: [false, true, false, true],
    },
    {
      text: TRANSFER_NUMBER_VALUE,
      style: 'hdrSchedule',
      border: [false, true, true, true],
    },
  ];

  // Row 3
  const SCHEDULE_TITLE = `SCHEDULE: ${selSchedule.title}`;
  const FROM_TITLE = `FROM: ${store.getters[
    'institutions/getInstitutionIdByOrigin'
  ](selSchedule.origin)}`;
  const TO_TITLE = `TO: ${selSchedule.destination}`;
  const VIAS_TITLE = `VIAS: ${selSchedule.vias.join(', ')}`;
  const ROW_3 = [
    // ? NOTE: Why is this in a seperate table object
    {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          [
            {
              text: SCHEDULE_TITLE,
              style: 'hdrSchedule',
              border: [false, false, false, false],
            },
            {
              text: FROM_TITLE,
              style: 'hdrSchedule',
              border: [false, false, false, false],
            },
            {
              text: TO_TITLE,
              style: 'hdrSchedule',
              border: [false, false, false, false],
            },
            {
              text: VIAS_TITLE,
              style: 'hdrSchedule',
              border: [false, false, false, false],
            },
          ],
        ],
      },
      colSpan: 3,
      margins: [0, 0, 0, 0],
    },
  ];

  return {
    margin: [10, 10, 10, 10],
    table: {
      widths: ['auto', '*', 'auto'],
      body: [ROW_1, ROW_2, ROW_3],
    },
  };
};

const _ddTransferRecordFooter = (currentPage, pageCount) => {
  const INSTITUTION_LABEL = 'INSTITUTION';

  const PREPARED_BY_LABEL = 'PREPARED BY';
  const TITLE_LABEL = 'TITLE';
  const SENDING_INSTITUTION_LABEL = 'SENDING INSTITUTION';
  const ROW_1 = [
    {
      text: PREPARED_BY_LABEL,
      style: 'hdrSchedule',
      border: [true, true, false, true],
      margin: [2, 2, 2, 16],
    },
    {
      text: TITLE_LABEL,
      style: 'hdrSchedule',
      border: [false, true, false, true],
      margin: [2, 2, 2, 16],
    },
    {
      text: SENDING_INSTITUTION_LABEL,
      style: 'hdrSchedule',
      border: [false, true, true, true],
      margin: [2, 2, 2, 16],
    },
  ];

  const ACKNOWLEDGEMENT_LABEL =
    'Receipt of the above-name persons and their records is acknowledged';
  const ROW_2 = [
    {
      text: ACKNOWLEDGEMENT_LABEL,
      fontSize: 8,
      alignment: 'center',
      margin: [2, 2, 2, 16],
      colSpan: 3,
    },
    {},
    {},
  ];

  const SIGNATURE_OF_TRANSPORTING = 'SIGNATURE OF TRANSPORTING OFFICER';
  const ROW_3 = [
    {
      text: SIGNATURE_OF_TRANSPORTING,
      style: 'hdrSchedule',
      border: [true, true, false, true],
      margin: [2, 2, 2, 16],
    },
    {
      text: TITLE_LABEL,
      style: 'hdrSchedule',
      border: [false, true, false, true],
      margin: [2, 2, 2, 16],
    },
    {
      text: INSTITUTION_LABEL,
      style: 'hdrSchedule',
      border: [false, true, true, true],
      margin: [2, 2, 2, 16],
    },
  ];

  const SIGNATURE_OF_RECEIVING = 'SIGNATURE OF RECEIVING OFFICER';
  const ROW_4 = [
    {
      text: SIGNATURE_OF_RECEIVING,
      style: 'hdrSchedule',
      border: [true, true, false, true],
      margin: [2, 2, 2, 16],
    },
    {
      text: TITLE_LABEL,
      style: 'hdrSchedule',
      border: [false, true, false, true],
      margin: [2, 2, 2, 16],
    },
    {
      text: INSTITUTION_LABEL,
      style: 'hdrSchedule',
      border: [false, true, true, true],
      margin: [2, 2, 2, 16],
    },
  ];

  // Last row with page count
  const PAGE_COUNT = [
    {
      text: currentPage.toString() + ' of ' + pageCount,
      fontSize: 9,
      alignment: 'center',
      border: [false, false, false, false],
      colSpan: 3,
    },
  ];

  return {
    margin: [10, 10, 10, 10],
    table: {
      widths: ['35%', '30%', '35%'],
      body: [ROW_1, ROW_2, ROW_3, ROW_4, PAGE_COUNT],
    },
  };
};

/**
 *
 * @param {Array} transfers
 * @returns {Object} The content object
 */
const _ddTransferRecordContent = (transfers) => {
  const TABLE_HEADERS = {
    '#': (transfer, index) => {
      return index++;
    },
    'CDCR #': (transfer) => transfer.cdcrNumber,
    Name: (transfer) => transfer.lastName + ', ' + transfer.firstName,
    Level: (transfer) =>
      transfer.endorsedSecurityLevel !== 'NA'
        ? transfer.endorsedSecurityLevel
        : transfer.securityLevel,
    Housing: (transfer) => transfer.housing,
    'TB Cd': (transfer) => transfer.tbCode,
    Ethnic: (transfer) => transfer.ethnicity,
    'Case Factor': (transfer) => transfer.caseFactor,
    'Specific Transfer Reason': (transfer) => transfer.transferReasonCode,
    '135 Comments': (transfer) => transfer.comments,
  };

  // Loop through every transfer for the schedule passed in
  const tableData = [];
  transfers.forEach((transfer, transferNumber) => {
    // Compute the row for each transfer
    const rowData = [];
    Object.keys(TABLE_HEADERS).forEach((header) => {
      rowData.push({
        text: TABLE_HEADERS[header](transfer, transferNumber),
        style: 'tblData',
        border: [false, false, false, false],
      });
    });
    tableData.push(rowData);
  });

  return {
    layout: {
      // code from lightHorizontalLines:
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return i === node.table.headerRows ? 2 : 1;
      },
      // eslint-disable-next-line no-unused-vars
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#aaa';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i, node) {
        return i === node.table.widths.length - 1 ? 0 : 8;
      },
      // code for zebra style:
      fillColor: function (i) {
        return i % 2 !== 0 ? '#F0F0F0' : null;
      },
    },
    table: {
      layout: 'lightHorizontalLines',
      headerRows: 1,
      widths: [
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        '*',
      ],
      body: [
        Object.keys(TABLE_HEADERS).map((header) => {
          return { text: header, style: 'tblHeader' };
        }),
        ...tableData,
      ],
    },
  };
};

/**
 * This prints the Transfer Record given a schedule and an array of transfers.
 *
 * @param {Object} selSchedule
 * @param {Array} transfers
 * @returns {Promise} Once resolved, a pdf document the browser will prompt you to download
 */
const create135 = async (selSchedule, transfers) => {
  if (!selSchedule || !transfers) {
    console.error('create135 missing selSchedule or transfers');
    return;
  }
  const myDate = new Date().toLocaleDateString();
  const myTime = new Date().toLocaleTimeString().replace(' ', '_');
  const myDateTime = `${myDate}_${myTime}`; // MM/DD/YYYY_HH:mm:ss_AM
  let fileName = `135_${selSchedule.title}_${myDateTime}.pdf`;
  if (transfers.length === 1) {
    fileName = `135_${transfers[0].cdcrNumber}_${myDateTime}.pdf`;
  }

  const documentDefinition = {
    pageSize: 'LETTER',
    pageMargins: [10, 80, 10, 160],
    borders: Array(4).fill(true),
    header: _ddTransferRecordHeader(selSchedule, transfers.length),
    footer: _ddTransferRecordFooter, // pdfMake will pass (Number: currentPage, Number: pageCount) as part of the callback
    content: _ddTransferRecordContent(transfers),
    styles: _ddTransferRecordStyle(),
  };
  await pdfMake.createPdf(documentDefinition).download(fileName);
};

export default create135;
