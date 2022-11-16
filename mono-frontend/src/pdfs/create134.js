/**
 * This pdf document prints the Transfer Check Sheet given a schedule.
 *
 * create134() creates the documentDefinition object that gets passed into pdfMake.createPdf(...).download(...)
 * https://pdfmake.github.io/docs/0.1/document-definition-object/
 *
 * The styles, header, footer, and content are generated from helper functions
 */

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import store from '@/store/';

// writeRotatedText(text)
// define your function for generating rotated text
function writeRotatedText(text) {
  let ctx,
    canvas = document.createElement('canvas');
  // I am using predefined dimensions so either make this part of the arguments or change at will
  canvas.width = 36;
  canvas.height = 720;
  // canvas.style = 'border: 1px solid red;';
  ctx = canvas.getContext('2d');
  ctx.font = '36pt Arial';
  // ctx.style = 'border: 1px solid red;';
  ctx.save();
  ctx.translate(36, 720);
  ctx.rotate(-0.5 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return canvas.toDataURL();
}

const _ddTransferRecordStyle = () => {
  return {
    hdrLeft: {
      fontSize: 10,
      bold: true,
    },
    hdrRight: {
      fontSize: 10,
      alignment: 'right',
      bold: true,
    },
    hdrCopies: {
      fontSize: 9,
      alignment: 'right',
    },
    hdrSchedule: {
      fontSize: 10,
      bold: true,
    },
    tblHeader: {
      fontSize: 10,
      bold: true,
      margin: [1, 2, 1, 2],
    },
    tblLeft: {
      fontSize: 10,
      margin: [1, 3, 1, 3],
    },
    tblCenter: {
      fontSize: 10,
      alignment: 'center',
      margin: [1, 3, 1, 3],
    },
  };
};

const _ddTransferRecordHeader = () => {
  //Row 1
  const DOC_TITLE = 'STATE OF CALIFORNIA';
  const AGENCY = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
  const ROW_1 = [
    {
      text: DOC_TITLE,
      style: 'hdrLeft',
      border: [false, false, false, false],
    },
    {
      text: AGENCY,
      style: 'hdrRight',
      border: [false, false, false, false],
    },
  ];

  const REPORT_TITLE = 'RECORDS TRANSFER CHECK SHEET';
  const REPORT_NAME = 'CDCR 134 (Rev. 03/06)';
  const TEXT_ORIGINAL = 'Original-Receiving Facility/Region Records';
  const TEXT_COPY = 'Copy-Sending Facility/Region Records';
  const ROW_2 = [
    {
      text: `${REPORT_TITLE}\n${REPORT_NAME}`,
      style: 'hdrLeft',
      border: [false, false, false, false],
    },
    {
      text: `${TEXT_ORIGINAL}\n${TEXT_COPY}`,
      style: 'hdrCopies',
      border: [false, false, false, false],
    },
  ];

  return {
    margin: [10, 10, 10, 10],
    borders: [false, false, false, false],
    table: {
      border: [false, false, false, false],
      widths: ['*', '*'],
      body: [ROW_1, ROW_2],
    },
  };
};

/**
 *
 * @param {Array} transfers
 * @returns {Object} The content object
 */
const _ddGet134Content = (schedule, transfers) => {
  let data = [];
  let row = [];
  let obj = [];

  // HEADER ROW 1
  const SCHEDULE_DATE = `DATE:  ${schedule.transferDate}`;
  const NUMBER_TRANSFERRING = `NUMBER TRANSFERRING:  ${transfers.length}`;
  const CHECKLIST = [
    'Central File',
    'Slough File / Lifer Packets',
    'Photos & Negatives',
    'Discharge File / Microfiche',
    'CDCR 1066 Outcard',
    'CDCR 114-A Isolation Seg File',
    'Visiting Records',
    'CDCR 103-F Education',
    'Health Records',
    'Psychiatric File',
    'X-Ray - Do Not Forward to Parole',
    'OTC / CCF / WF / DTF Flimsy',
    'Temporary Medical File',
    'Confidential File',
    ' ',
    ' ',
  ];

  obj = {
    style: 'hdrSchedule',
    margin: [2, 8, 2, 20],
    colSpan: 2,
  };
  obj.text = SCHEDULE_DATE;
  row.push(Object.assign({}, obj));
  row.push(Object.assign({}, {}));
  obj.text = NUMBER_TRANSFERRING;
  row.push(Object.assign({}, obj));
  row.push(Object.assign({}, {}));

  obj = {
    fit: [7, 303],
    style: 'hdrLeft',
    margin: [2, 20, 2, 2],
    rowSpan: 4,
  };
  for (let item of CHECKLIST) {
    obj.image = writeRotatedText(item);
    row.push(Object.assign({}, obj));
  }

  data.push(row);
  row = [];

  // HEADER ROW 2
  const SCHEDULE_FROM = `FROM:  ${store.getters[
    'institutions/getInstitutionIdByOrigin'
  ](schedule.origin)}`;
  obj = {
    text: SCHEDULE_FROM,
    style: 'hdrSchedule',
    margin: [2, 8, 2, 30],
    colSpan: 4,
  };
  row.push(Object.assign({}, obj));
  row.push(Object.assign({}, {})); // Empty column for alignment purposes
  row.push(Object.assign({}, {})); // Empty column for alignment purposes
  row.push(Object.assign({}, {})); // Empty column for alignment purposes
  obj = { text: ' ', colSpan: 16 }; // Empty column occupied by vertical text
  row.push(Object.assign({}, obj));

  data.push(row);
  row = [];

  // HEADER ROW 3
  const SCHEDULE_TO = `TO:  ${schedule.destination}`;
  const SCHEDULE_VIAS = `VIAS:  ${schedule.vias.join(', ')}`;
  obj = {
    style: 'hdrSchedule',
    margin: [2, 8, 2, 30],
    colSpan: 2,
  };
  obj.text = SCHEDULE_TO;
  row.push(Object.assign({}, obj));
  row.push(Object.assign({}, {}));
  obj.text = SCHEDULE_VIAS;
  row.push(Object.assign({}, obj));
  row.push(Object.assign({}, {}));
  obj = { text: ' ', colSpan: 16 }; // Empty column occupied by vertical text
  row.push(Object.assign({}, obj));

  data.push(row);
  row = [];

  // HEADER ROW 4
  // Table data Header
  row.push(Object.assign({}, { text: 'CDCR #', style: 'tblHeader' }));
  row.push(Object.assign({}, { text: 'Name', style: 'tblHeader', colSpan: 2 }));
  row.push(Object.assign({}, {}));
  row.push(Object.assign({}, { text: 'Discharge Date', style: 'tblHeader' }));
  row.push(Object.assign({}, { text: ' ', colSpan: 16 })); // Empty column occupied by vertical text

  data.push(row);
  row = [];

  // DATA ROWS
  for (let xfr of transfers) {
    // Column 1 - CDCR Number
    obj = {
      text: xfr.cdcrNumber,
      style: 'tblLeft',
    };
    row.push(Object.assign({}, obj));
    // Column 2 - Last Name, First Name - colspan = 2
    obj = {
      text: xfr.lastName + ', ' + xfr.firstName,
      style: 'tblLeft',
      colSpan: 2,
    };
    row.push(Object.assign({}, obj));
    // Column 3 - Empty cell
    obj = { text: ' ', style: 'tblCenter' };
    row.push(Object.assign({}, obj));
    // Column 4 - Discharge Date
    obj = {
      text: new Date(xfr.releaseDate).toISOString().split('T')[0],
      style: 'tblLeft',
    };
    row.push(Object.assign({}, obj));
    // Column 5 - 20 Empty cell
    for (let i = 5; i < 21; i++) {
      obj = { text: ' ', style: 'tblCenter' };
      row.push(Object.assign({}, obj));
    }

    data.push(row);
    row = [];
  }

  // [EmptySheet];
  // Fill empty rows to max 24 per page
  const nXfrs =
    transfers.length < 23 ? transfers.length : transfers.length % 23;
  const len = 23 - nXfrs;
  const emptyColumn = {
    text: ' ',
    style: 'tblLeft',
    // border: [false, false, false, false],
  };
  const col2 = {
    text: ' ',
    style: 'tblLeft',
    colSpan: 2,
  };
  for (let i = 0; i < len; i++) {
    for (let n = 0; n < 20; n++) {
      if (n !== 1) {
        row.push(Object.assign({}, emptyColumn));
      } else {
        row.push(Object.assign({}, col2));
      }
    }
    data.push(row);
    row = [];
  }

  return {
    layout: {
      // eslint-disable-next-line
      fillColor: function (rowIndex, node, columnIndex) {
        if (rowIndex < 4) {
          return null;
        }
        return rowIndex % 2 === 0 ? '#F0F0F0' : null;
      },
    },
    table: {
      headerRows: 4,
      widths: [
        '*',
        'auto',
        '*',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
        'auto',
      ],
      body: [...data],
      border: [true, true, true, true],
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
const create134 = async (selSchedule, transfers) => {
  if (!selSchedule || !transfers) {
    console.error('create134 missing selSchedule or transfers');
    return;
  }

  let from = store.getters['institutions/getInstitutionIdByOrigin'](
    selSchedule.origin
  );

  let today = new Date().toISOString().split('T')[0];
  const fileName = `134_${from}_${today}.pdf`;

  const docDef = {
    pageSize: 'LETTER',
    pageMargins: [10, 60, 10, 10],
    header: _ddTransferRecordHeader(),
    content: _ddGet134Content(selSchedule, transfers),
    styles: _ddTransferRecordStyle(),
  };
  console.log('create134(): docDef => ', docDef);
  await pdfMake.createPdf(docDef).download(fileName);
};

export default create134;
