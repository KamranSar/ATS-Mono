import store from '@/store';
import pdfMake from 'pdfmake/build/pdfmake';
import myApp from '@/config/myApp.js';
import { FORMAT } from '@/mixins/DatePicker.js';
import { format, formatISO, isMatch } from 'date-fns';
const AGENCY = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
const REPORT_TITLE = 'BUS ORDER SEAT REQUEST';

// build

// _createBusOrderSeatPDF()
// Creates the document format for the Bus Order Seat Request report
// Creates a pdf file using PDFMake
// ********************************
const _createBusOrderSeatPDF = (data) => {
  // No need for defensive coding to check for selectedInstitution, already done
  const selectedInstitution = store.state.institutions.selectedInstitution;
  const from =
    selectedInstitution.institutionId +
    ' - ' +
    selectedInstitution.institutionName;
  const FILE_NAME = `BusOrderSeat_${from}_${formatISO(new Date())}.pdf`;

  console.log('_createBusOrderSeatPDF(): data => ', data);
  console.log('_createBusOrderSeatPDF(): FILE_NAME => ', FILE_NAME);
  const dd = {
    defaultStyle: {
      fontSize: 11,
    },

    pageSize: 'LETTER', // 'LETTER'
    pageOrientation: 'LANDSCAPE',
    pageMargins: Array(4).fill(25),

    styles: {
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
    },

    footer: function (currentPage, pageCount) {
      let footer = {
        text: currentPage.toString() + ' of ' + pageCount,
        alignment: 'center',
      };
      return footer;
    },

    content: [
      // =============================
      // Report From & Date
      // =============================
      {
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
      },
      // =============================
      // Agency
      // =============================
      {
        columns: [
          {
            text: AGENCY,
            style: 'header',
            alignment: 'center',
            margin: [0, 2, 0, 0],
          },
        ],
      },
      // =============================
      // Application Name
      // =============================
      {
        columns: [
          {
            text: myApp.name,
            style: 'header',
            alignment: 'center',
            margin: [0, 2, 0, 0],
          },
        ],
      },
      // =============================
      // Report Title
      // =============================
      {
        columns: [
          {
            text: REPORT_TITLE,
            style: 'header',
            alignment: 'center',
            margin: [0, 2, 0, 0],
          },
        ],
      },
      // =============================
      // Endorsed To
      // =============================
      {
        columns: [
          {
            text: '',
            style: 'header',
          },
        ],
      },
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
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,

              // Determines the width of each column.
              // auto = fit to contents
              // * = stretch to fill
              // widths: ['*', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
              widths: ['*', ...Array(10).fill('auto')],

              // The ... is a operator that expands the array or flattens
              // The header row is then combined with the data to make one array
              body: [
                [
                  {
                    // Column 1
                    text: 'CDCR #',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                    // margin: [ 2, 3, 2, 3],
                  },
                  {
                    // Column 2
                    text: 'Name',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 3
                    text: 'Scheduled',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 4
                    text: 'Level',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 5
                    text: 'Endorsed Date',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 6
                    text: 'Expire Date',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 7
                    text: 'Release Date',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 8
                    text: 'Case Factors',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 9
                    text: 'Ethnicity',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 10
                    text: 'Housing',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    // Column 11
                    text: 'Remarks',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                ],
                ...data,
              ], // End of Table Body
              border: [false, false, false, false],
            },
          },
        ],
      },
    ],
  };

  console.log('_createBusOrderSeatPDF(): dd => ', dd);
  pdfMake.createPdf(dd).download(FILE_NAME);

  // alert("_createBusOrderSeatPDF() Done!");
};

const createBusOrderSeat = async ({
  dateEndorsed,
  selEndorsedTo,
  includeScheduled,
  arrivalDate,
}) => {
  const filter = {
    query: {
      $limit: 50,
      $sort: {
        endorsedDate: 1,
      },
    },
  };

  // Selected instititution is required
  const selectedInstitution = store.state.institutions.selectedInstitution
    ? store.state.institutions.selectedInstitution
    : null;
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

  if (includeScheduled) {
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

  try {
    const endorsements = await store.dispatch(
      'transfers/readTransfers',
      filter
    );

    if (!endorsements || !endorsements.length) {
      store.dispatch('app/SET_SNACKBAR', {
        top: true,
        center: true,
        message: `No Endorsements found for institution: ${selectedInstitution.institutionName}`,
      });
      return;
    }

    let data = [];
    let row = [];
    let obj = [];
    let location = '';
    for (let e of endorsements) {
      if (e.endorsedToName != location) {
        console.log('createBusOrderSeat(): e => ', e);
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
        console.log('createBusOrderSeat(): data => ', data);
      }

      // Column 1 - CDCR Number
      console.log('createBusOrderSeat(): cdcrNumber => ', e.cdcrNumber);
      obj = {
        text: e.cdcrNumber,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 2 - Name
      obj = {
        text: e.lastName + ', ' + e.firstName,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 3 - Schedule
      obj = {
        text: e.schedule,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 4 - Level
      obj = {
        text: e.securityLevel,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 5 - Endorsed Date
      obj = {
        text: e.currentEndorsementDate,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 6 - Endorsement Expiration Date
      obj = {
        text: e.expirationEndorsementDate,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 7 - Release Date
      obj = {
        text: e.releaseDate,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 8 - Case Factor
      obj = {
        text: e.caseFactor,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 9 - Ethnicity
      obj = {
        text: e.ethnicity,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 10 - Housing
      obj = {
        text: e.housing,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Column 11 - In House Remarks
      obj = {
        text: e.inHouseRemarks,
        style: 'tblEntry',
        border: [false, false, false, false],
      };
      row.push(Object.assign({}, obj));

      // Add row to data to be pushed to PDF
      data.push(row);
      row = [];
      console.log('createBusOrderSeat(): data => ', data);
    }
    if (data) {
      _createBusOrderSeatPDF(data);
    } else {
      // error message
      store.dispatch('app/SET_SNACKBAR', {
        top: true,
        center: true,
        messsage: 'Could not create CDCR Bus Order Seat Request PDF Document!',
      });
    }
  } catch (ex) {
    store.dispatch('app/SET_SNACKBAR', {
      top: true,
      center: true,
      message: 'Failed to generate bus order seat report, try again later',
    });
    console.error('createBusOrderSeat() exception: ', ex);
  }
};

export default createBusOrderSeat;
