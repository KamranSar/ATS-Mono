import store from '@/store';
import pdfMake from 'pdfmake/build/pdfmake';
import myApp from '@/config/myApp.js';
import { FORMAT } from '@/mixins/DatePicker.js';
import { format, formatISO, isMatch } from 'date-fns';

const _getEndorsements = async ({
  dateEndorsed,
  selEndorsedTo,
  includeScheduled,
  arrivalDate,
  selectedInstitution,
}) => {
  const filter = {
    query: {
      $limit: 50,
      $sort: {
        endorsedDate: 1,
        endorsedToName: 1,
      },
    },
  };

  filter.query.institutionId = selectedInstitution.institutionId;
  filter.query.endorsedInstitution = {
    $ne: selectedInstitution.institutionName,
  };

  if (
    dateEndorsed &&
    Array.isArray(dateEndorsed) &&
    dateEndorsed[0] &&
    dateEndorsed[1]
  ) {
    // If currentEndorsementDate is between the range....
    filter.query['$or'] = [
      {
        currentEndorsementDate: {
          $gte: dateEndorsed[0],
          $lte: dateEndorsed[1],
        },
      },
      // Or if originalEndorsementDate is between the range...
      {
        originalEndorsementDate: {
          $gte: dateEndorsed[0],
          $lte: dateEndorsed[1],
        },
      },
    ];
  }

  if (selEndorsedTo) {
    filter.query.endorsedToId = selEndorsedTo;
  }

  if (includeScheduled === false) {
    filter.query.isScheduled = includeScheduled;
  }

  if (
    arrivalDate &&
    Array.isArray(arrivalDate) &&
    arrivalDate[0] &&
    arrivalDate[1]
  ) {
    // FIXME: Backend API is expecting 02/17/2022 instead of ISO date
    if (isMatch(arrivalDate[0], FORMAT.ISO_DATE)) {
      const [fromYear, fromMonth, fromDay] = arrivalDate[0].split('-');
      const [toYear, toMonth, toDay] = arrivalDate[1].split('-');
      arrivalDate[0] = `${fromMonth}/${fromDay}/${fromYear}`;
      arrivalDate[1] = `${toMonth}/${toDay}/${toYear}`;
    }

    filter.query.transferDate = {
      $gte: arrivalDate[0],
      $lte: arrivalDate[1],
    };
  }

  const endorsements = await store.dispatch('transfers/readTransfers', filter);

  return endorsements;
};

const _ddBusOrderSeatStyles = () => {
  return {
    header: {
      bold: true,
      fontSize: 9,
    },

    appName: {
      bold: true,
      fontSize: 10,
    },

    reportTitle: {
      alignment: 'center',
      bold: true,
      fontSize: 11,
    },

    tblHeader: {
      bold: true,
      fontSize: 10,
      margin: [2, 3, 2, 3],
    },

    schEntry: {
      bold: true,
      fontSize: 10,
    },

    tblEntry: {
      alignment: 'center',
      fontSize: 10,
    },
  };
};

const _ddBusOrderSeatFooter = (currentPage, pageCount) => {
  let footer = {
    text: currentPage.toString() + ' of ' + pageCount,
    alignment: 'center',
  };
  return footer;
};

const _ddBusOrderSeatContent = (endorsements, from) => {
  const AGENCY = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
  const REPORT_TITLE = 'BUS ORDER SEAT REQUEST';
  const TABLE_HEADERS = {
    'CDCR #': (transfer) => transfer.cdcrNumber,
    Name: (transfer) => transfer.lastName + ', ' + transfer.firstName,
    Scheduled: (transfer) => (transfer.isScheduled ? 'YES' : 'NO'),
    Level: (transfer) => transfer.endorsedSecurityLevel,
    'Endorsed Date': (transfer) => transfer.currentEndorsementDate,
    'Expire Date': (transfer) => transfer.expirationEndorsementDate,
    'Release Date': (transfer) => transfer.releaseDate,
    'Case Factors': (transfer) => transfer.caseFactor,
    Ethnicity: (transfer) => transfer.ethnicity,
    Housing: (transfer) => transfer.housing,
    'In House Remarks': (transfer) => transfer.inHouseRemarks,
  };

  let data = [];
  let row = [];
  let obj = [];
  let location = '';
  for (let e of endorsements) {
    if (e.endorsedToName != location) {
      location = e.endorsedToName;
      let insId = e.endorsedToId;
      const strText = ` ----- ${insId} --- ${location} -----`;
      // Insert Origin row
      // Column 1 - Location string
      obj = {
        text: strText,
        style: 'schEntry',
        border: [false, false, false, false],
        colSpan: 11,
      };
      row.push(obj);

      const emptyColumn = {
        text: ' ',
        style: 'schEntry',
        border: [false, false, false, false],
      };
      row.push(Array(9).fill(emptyColumn));
      data.push(row);

      row = [];
    }

    Object.keys(TABLE_HEADERS).forEach((h) => {
      obj = {
        text: [TABLE_HEADERS[h](e)],
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));
    });

    // Add row to data to be pushed to PDF
    data.push(row);
    row = [];
  }

  // =============================
  // Report From & Date
  // =============================
  const ROW_1 = {
    columns: [
      {
        text: from,
        style: 'header',
      },
      {
        text: format(new Date(), 'MM/dd/yyyy hh:mm'), //'02/11/2021 08:08',
        style: 'header',
        alignment: 'right',
      },
    ],
  };

  // =============================
  // Agency
  // =============================
  const ROW_2 = {
    columns: [
      {
        text: AGENCY,
        style: 'header',
        alignment: 'center',
        margin: [0, 2, 0, 0],
      },
    ],
  };

  // =============================
  // Application Name
  // =============================
  const ROW_3 = {
    columns: [
      {
        text: myApp.name,
        style: 'header',
        alignment: 'center',
        margin: [0, 2, 0, 0],
      },
    ],
  };

  // =============================
  // Report Title
  // =============================
  const ROW_4 = {
    columns: [
      {
        text: REPORT_TITLE,
        style: 'header',
        alignment: 'center',
        margin: [0, 2, 0, 0],
      },
    ],
  };

  // =============================
  // Endorsed To
  // =============================
  const ROW_5 = {
    columns: [
      {
        text: '',
        style: 'header',
      },
    ],
  };

  const TABLE_OF_CONTENTS =
    // =============================
    // Table of Report Records
    // =============================
    {
      columns: [
        {
          width: '*',
          layout: {
            // eslint-disable-next-line
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? '#F0F0F0' : null;
            },
          },
          table: {
            headerRows: 1,
            // Determines the width of each column.
            // * = stretch to fill
            widths: ['*', ...Array(10).fill('auto')],
            body: [
              Object.keys(TABLE_HEADERS).map((text) => {
                return {
                  text,
                  style: 'tblHeader',
                  border: [false, true, false, true],
                };
              }),
              ...data,
            ], // End of Table Body
            border: Array(4).fill(false),
          },
        },
      ],
    };

  return [ROW_1, ROW_2, ROW_3, ROW_4, ROW_5, TABLE_OF_CONTENTS];
};

const createBusOrderSeat = async ({
  dateEndorsed,
  selEndorsedTo,
  includeScheduled,
  arrivalDate,
  selectedInstitution,
}) => {
  if (!selectedInstitution) {
    store.dispatch('app/SET_SNACKBAR', {
      top: true,
      center: true,
      color: 'info',
      message: 'Please select an institution and try again.',
      timeout: 3000,
    });
    return;
  }

  const endorsements = await _getEndorsements({
    dateEndorsed,
    selEndorsedTo,
    includeScheduled,
    arrivalDate,
    selectedInstitution,
  });

  if (!endorsements || !endorsements.length) {
    store.dispatch('app/SET_SNACKBAR', {
      top: true,
      center: true,
      message: `No Endorsements found for institution: ${selectedInstitution.institutionName}`,
    });
    return;
  }

  const from =
    selectedInstitution.institutionId +
    ' - ' +
    selectedInstitution.institutionName;
  const FILE_NAME = `BusOrderSeat_${from}_${formatISO(new Date())}.pdf`;
  console.log('_createBusOrderSeatPDF(): FILE_NAME => ', FILE_NAME);

  const dd = {
    defaultStyle: {
      fontSize: 11,
    },
    pageSize: 'LETTER',
    pageOrientation: 'LANDSCAPE',
    pageMargins: Array(4).fill(25),
    styles: _ddBusOrderSeatStyles(),
    footer: _ddBusOrderSeatFooter,
    content: _ddBusOrderSeatContent(endorsements, from),
  };

  pdfMake.createPdf(dd).download(FILE_NAME);
};
export default createBusOrderSeat;
