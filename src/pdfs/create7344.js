import store from '@/store';
import findAll from '@cdcr/vue-frontend/feathers/helpers/findAll.js';
import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const _ddAdvancedTransferNoticeStyle = () => {
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
      fontSize: 9,
    },

    tblEntry: {
      fontSize: 10,
    },
  };
};

const _ddAdvancedTransferNoticeFooter = (currentPage, pageCount) => {
  let footer = {
    text: currentPage.toString() + ' of ' + pageCount,
    alignment: 'center',
  };
  return footer;
};

const _ddAdvancedTransferNoticeContent = async (
  selectedInstitution,
  dateBegin,
  dateEnd
) => {
  // Get transfer for selected schedule
  const filter = {
    query: {
      $limit: 50,
      $sort: {
        transferDate: 1,
      },
      transferDate: {
        $gte: dateBegin,
        $lte: dateEnd,
      },
      origin: selectedInstitution.institutionName,
    },
  };

  const { data: advTransfers } = await findAll(departuresArrivalsSvc, filter);
  if (!advTransfers.length) {
    store.dispatch('SET_SNACKBAR', {
      top: true,
      message: 'No Transfers found for requested date range.',
    });
  }

  const TABLE_HEADERS = {
    'CDCR #': (transfer) => transfer.cdcrNumber,
    Name: (transfer) => transfer.lastName + ', ' + transfer.firstName,
    Housing: (transfer) => transfer.housing,
    Bed: (transfer) => (transfer.bed ? transfer.bed : ''),
    Level: (transfer) =>
      transfer.endorsedSecurityLevel && transfer.endorsedSecurityLevel !== 'NA'
        ? transfer.endorsedSecurityLevel
        : transfer.securityLevel,
    Ethnic: (transfer) => transfer.ethnicity,
    'Specific Transfer Reason': (transfer) => transfer.transferReasonCode,
  };
  const TABLE_DATA = [];
  console.log('advTransfers: ', advTransfers);
  advTransfers.forEach((transfer, index) => {
    const DATA_ROW = [
      // Column 1 - dashes
      {
        text: '-----',
        style: 'schEntry',
        border: [false, false, false, false],
        fillColor: '#F0F0F0',
      },
      // Column 2 - Date - Weekday, Month day, Year format
      {
        text: new Date(transfer.transferDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        style: 'schEntry',
        border: [false, false, false, false],
        colSpan: 2,
        fillColor: '#F0F0F0',
      },
      // Column 3 - Empty column
      {
        text: ' ',
        border: [false, false, false, false],
        fillColor: '#F0F0F0',
      },
      // Column 4 - Schedule
      {
        text: transfer.title,
        style: 'schEntry',
        border: [false, false, false, false],
        fillColor: '#F0F0F0',
      },
      // Column 5 - Destination
      {
        text: transfer.destination,
        style: 'schEntry',
        border: [false, false, false, false],
        fillColor: '#F0F0F0',
      },
      // Column 6 - Vias
      {
        text: transfer.vias.join(', '),
        style: 'schEntry',
        border: [false, false, false, false],
        fillColor: '#F0F0F0',
      },
      // Column 7 - dashes
      {
        text: '-----',
        style: 'schEntry',
        border: [false, false, false, false],
        fillColor: '#F0F0F0',
      },
    ];

    if (
      index === 0 ||
      transfer.scheduleId !== advTransfers[index - 1].scheduleId
    ) {
      TABLE_DATA.push(DATA_ROW);
    }

    TABLE_DATA.push(
      Object.keys(TABLE_HEADERS).map((h) => TABLE_HEADERS[h](transfer))
    );
  });

  // =============================
  // State and Agency
  // =============================
  const DOC_TITLE = 'STATE OF CALIFORNIA';
  const AGENCY = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';
  const HEADER_ROW_1 = {
    columns: [
      {
        text: DOC_TITLE,
        style: 'header',
      },
      {
        text: AGENCY,
        style: 'header',
        alignment: 'right',
      },
    ],
  };

  // =============================
  // Report Form & Date
  // =============================
  const REPORT_NAME = 'CDCR FORM 7344 (XX/XX)';
  const dateNow = new Date(); // Local Time
  const MM = (dateNow.getMonth() + 1).toString().padStart(2, '0');
  const dd = dateNow.getDate().toString().padStart(2, '0');
  const YYYY = dateNow.getFullYear();
  const HH = dateNow.getHours().toString().padStart(2, '0');
  const mm = dateNow.getMinutes().toString().padStart(2, '0');
  const REPORT_DATE_TIME = `${MM}/${dd}/${YYYY} ${HH}:${mm}`;
  const HEADER_ROW_2 = {
    columns: [
      {
        text: REPORT_NAME,
        style: 'header',
      },
      {
        text: REPORT_DATE_TIME,
        style: 'header',
        alignment: 'right',
      },
    ],
  };

  // =============================
  // Institution
  // =============================
  const INSTITUTION_LABEL = `Institution Name: ${selectedInstitution.institutionId}`;
  const HEADER_ROW_3 = {
    columns: [
      {
        text: INSTITUTION_LABEL,
        style: 'header',
        margin: [0, 8, 0, 0],
      },
    ],
  };

  // =============================
  // Report Title
  // =============================
  const REPORT_TITLE = 'ADVANCE TRANSFER NOTICE';
  const REPORT_TITLE_ROW = {
    columns: [
      {
        text: REPORT_TITLE,
        style: 'header',
        alignment: 'center',
        margin: [0, 3, 0, 0],
      },
    ],
  };

  // =============================
  // To
  // =============================
  const TO_LABEL = 'TO : All Departments';
  const TO_ROW = {
    columns: [
      {
        text: TO_LABEL,
        style: 'header',
        margin: [0, 3, 0, 0],
      },
    ],
  };

  // =============================
  // From
  // =============================
  const FROM_LABEL = 'FROM : Transfer Desk - Records Office';
  const FROM_ROW = {
    columns: [
      {
        text: FROM_LABEL,
        style: 'header',
        margin: [0, 3, 0, 0],
      },
    ],
  };

  // =============================
  // RE
  // =============================

  const TRANSFER_COUNT = advTransfers.length;
  const RE_LABEL = `RE : NUMBER TRANSFERRING  ${TRANSFER_COUNT}`;
  const RE_ROW = {
    columns: [
      {
        text: RE_LABEL,
        style: 'header',
        margin: [0, 3, 0, 0],
      },
    ],
  };

  // =============================
  // Instructions
  // =============================
  const INSTRUCTIONS =
    'The inmates listed below will be transferred as indicated.  Please forward all materials to the case records transfer desk immediately.';
  const INSTRUCTION_ROW = {
    columns: [
      {
        text: INSTRUCTIONS,
        fontSize: 9,
        margin: [5, 3, 5, 3],
      },
    ],
  };

  // =============================
  // Table of Report Records
  // =============================
  const TABLE = {
    columns: [
      {
        width: '*',
        layout: 'lightHorizontalLines',
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          // Determines the width of each column.
          // auto = fit to contents
          // * = stretch to fill
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
          body: [
            // Header Row
            Object.keys(TABLE_HEADERS).map((h) => {
              return {
                text: h,
                style: 'tblHeader',
                border: [false, true, false, true],
              };
            }),
            ...TABLE_DATA,
          ],
          border: Array(4).fill(false),
        },
      },
    ],
  };

  return [
    HEADER_ROW_1,
    HEADER_ROW_2,
    HEADER_ROW_3,
    REPORT_TITLE_ROW,
    TO_ROW,
    FROM_ROW,
    RE_ROW,
    INSTRUCTION_ROW,
    TABLE,
  ];
};

/**
 * Creates an Advanced Transfer Notice
 *
 * @param {Object} selectedInstitution
 * @param {Object} data
 */
const create7344 = async (selectedInstitution, dateBegin, dateEnd) => {
  if (!selectedInstitution || !dateBegin || !dateEnd) {
    store.dispatch('app/SET_SNACKBAR', {
      top: true,
      message:
        'Institution, begin date, and end date are required to create an Advanced Transfer Notice peport',
    });
    return;
  }

  if (dateBegin > dateEnd) {
    store.dispatch('app/SET_SNACKBAR', {
      top: true,
      message:
        'The date range is invalid. End date is earlier than Begin date. Please fix and try again.',
    });
    return;
  }

  const fileName = `7344_${
    selectedInstitution.institutionId
  }_${new Date().toISOString()}.pdf`;

  const dd = {
    defaultStyle: {
      fontSize: 11,
    },
    pageSize: 'LETTER',
    pageOrientation: 'PORTRAIT',
    pageMargins: [25, 25, 25, 25],
    styles: _ddAdvancedTransferNoticeStyle(),
    // header: 'simple text', // Possible to move our header here?
    footer: _ddAdvancedTransferNoticeFooter,
    content: await _ddAdvancedTransferNoticeContent(
      selectedInstitution,
      dateBegin,
      dateEnd
    ),
  };

  pdfMake.createPdf(dd).download(fileName);
};

export default create7344;
