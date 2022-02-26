import departuresArrivalsSvc from '@/feathers/services/departuresarrivals/departuresarrivals.service.js';
import myApp from '@/config/myApp.js';
import store from '@/store';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const AGENCY = 'DEPARTMENT OF CORRECTIONS AND REHABILITATION';

/**
 * Fetches all the endorsements for the location passed in or all of them if none
 * and builds up the meta data for each location, level, and totals
 *
 * Example:
 * SAC: {
 *  levels: {
 *    'Level 4 (257)': _levelModel(),
 *   },
 *  totals: _totalsModel()
 * }
 *
 * @param {String} selEndorsedTo
 * @returns {Object} An object with the keys set to the institutionId
 */
async function _buildObjOfDestinations(selEndorsedTo) {
  // Factory function to build out the level object
  function _levelModel({
    scheduled = 0,
    unscheduled = 0,
    holds = 0,
    total = 0, // scheduled + unscheduled
  } = {}) {
    return {
      scheduled,
      unscheduled,
      holds,
      total,
    };
  }

  // Factory function to build out the totals object
  function _totalsModel({
    scheduled = 0,
    unscheduled = 0,
    holds = 0,
    totalOfTotals = 0,
  } = {}) {
    return {
      scheduled,
      unscheduled,
      holds,
      totalOfTotals,
    };
  }

  const listOfInstitutions = store.state.institutions.listOfInstitutions
    ? store.state.institutions.listOfInstitutions
    : [];
  const selectedInstitution = store.state.institutions.selectedInstitution
    ? store.state.institutions.selectedInstitution
    : null;

  let filter = {
    query: {
      $sort: {
        origin: 1,
      },
    },
  };

  if (selectedInstitution) {
    filter.query.origin = selectedInstitution.institutionName;
    filter.query.destination = {
      $ne: selectedInstitution.institutionName,
    };
  }

  if (selEndorsedTo) {
    filter.query.destination = selEndorsedTo;
  }
  console.log('crateBusSeat(): filter => ', filter);

  try {
    const response = await departuresArrivalsSvc.find(filter);
    console.log(
      'createBusSeat(): departuresArrivalsSvc.find(filter): response => ',
      response
    );

    if (!response) {
      alert('No Transfers found for requested date range.');
      return;
    }

    let objOfDestinations = {
      // Example:
      // SAC: {
      //   levels: {
      //     'Level 4 (257)': _levelModel(),
      //   },
      //   totals: _totalsModel()
      // },
    };

    // Loop through all inmates
    for (let inmate of response.data) {
      console.log(`Endorsing ${inmate.firstName} ${inmate.lastName}`, inmate);

      // Build out the destination for the inmate
      if (inmate.destination && !(inmate.destination in objOfDestinations)) {
        const institution = listOfInstitutions.find(
          (inst) => inst.institutionId === inmate.destination
        );
        objOfDestinations[inmate.destination] = {
          institutionId: institution ? institution.institutionId : '',
          institutionName: institution ? institution.institutionName : '',
          levels: {},
        };
      }
      const inmatesDestination = objOfDestinations[inmate.destination];

      // Build out the level for the destination
      if (
        inmate.securityLevel &&
        !(inmate.securityLevel in inmatesDestination.levels)
      ) {
        inmatesDestination.levels[inmate.securityLevel] = _levelModel();
      }
      const inmateLevel = inmatesDestination.levels[inmate.securityLevel];

      // FIXME: Are these types mutually exclusive
      // Holds
      if (inmate.transferHolds) {
        console.log(`\tHolding`);
        inmateLevel.holds++;
      } else if (inmate.scheduleId) {
        // Scheduled
        console.log(`\tScheduled`);
        inmateLevel.scheduled++;
      } else {
        // Unscheduled
        console.log(`\tUnscheduled`);
        inmateLevel.unscheduled++;
      }
      inmateLevel.total = inmateLevel.scheduled + inmateLevel.unscheduled; // Does not include holds

      // Accumulate the totals as we go
      if (!('totals' in inmatesDestination)) {
        inmatesDestination.totals = _totalsModel();
      }
      const destinationTotals = inmatesDestination.totals;
      destinationTotals.holds += inmateLevel.holds;
      destinationTotals.scheduled += inmateLevel.scheduled;
      destinationTotals.unscheduled += inmateLevel.unscheduled;
      destinationTotals.totalOfTotals += inmateLevel.total;

      return objOfDestinations;
    }
  } catch (error) {
    console.error('Error fetching endorsements', error);
    return {};
  }
}

function _buildDestination(destination) {
  const row = [];
  const strText = ` ----- ${destination.institutionId} - ${destination.institutionName} -----`;
  console.log('strText: ', strText);

  // Insert Origin row
  // Column 1 - Destination string
  let locCol = {
    text: strText,
    style: 'schEntry',
    border: [false, false, false, false],
    colSpan: 5,
  };
  row.push(locCol);

  // Column 2-5 - Empty
  const emptyCol = {
    text: ' ',
    style: 'schEntry',
    border: [false, false, false, false],
  };
  const emptyColumns = new Array(4).fill(emptyCol);
  row.push(...emptyColumns);
  return row;
}

function _buildSecurityLevels(securityLevels) {
  const row = [];
  console.log(Object.keys(securityLevels));

  for (let sl of Object.keys(securityLevels)) {
    // Column 1 - Level
    const levelCol = {
      text: sl,
      style: 'tblEntry',
      border: [false, false, false, false],
    };
    row.push(levelCol);

    // Column 2 - Scheduled
    const scheduledCol = {
      text: securityLevels[sl].scheduled,
      style: 'tblEntry',
      border: [false, false, false, false],
    };
    row.push(scheduledCol);

    // Column 3 - Unscheduled
    const unScheduledCol = {
      text: securityLevels[sl].unscheduled,
      style: 'tblEntry',
      border: [false, false, false, false],
    };
    row.push(unScheduledCol);

    // Column 4 - Hold
    const holdsCol = {
      text: securityLevels[sl].holds,
      style: 'tblEntry',
      border: [false, false, false, false],
    };
    row.push(holdsCol);

    // Column 5 - Total
    const totalCol = {
      text: securityLevels[sl].total,
      style: 'tblEntry',
      border: [false, false, false, false],
    };
    row.push(totalCol);
  }

  return row;
}

function _buildTotals(totals) {
  const row = [];
  // Insert Totals row
  // Column 1 - Location string
  const titleCol = {
    text: 'Total',
    style: 'tblEntry',
    border: [false, false, false, false],
  };
  row.push(titleCol);

  // Column 2 - Scheduled Total
  const totalSchedCol = {
    text: String(totals.scheduled).toString(),
    style: 'tblEntry',
    border: [false, false, false, false],
  };
  row.push(totalSchedCol);

  // Column 3 - Unscheduled Totals
  const totalUnschedCol = {
    text: String(totals.unscheduled).toString(),
    style: 'tblEntry',
    border: [false, false, false, false],
  };
  row.push(totalUnschedCol);

  // Column 4 - Hold Totals
  const totalHoldsCol = {
    text: String(totals.holds).toString(),
    style: 'tblEntry',
    border: [false, false, false, false],
  };
  row.push(totalHoldsCol);

  // Column 5 - Totals
  const totalOfTotalsCol = {
    text: String(totals.totalOfTotals).toString(),
    style: 'tblEntry',
    border: [false, false, false, false],
  };
  row.push(totalOfTotalsCol);

  return row;
}

// createBusSeatPDF()
// Creates the document format for the Bus Seat report
// Creates a pdf file using PDFMake
// ********************************
const _createBusSeatPDF = (data, selEndorsedTo) => {
  const selectedInstitution = store.state.institutions.selectedInstitution
    ? store.state.institutions.selectedInstitution
    : null;

  const today = new Date();
  const m = today.getMonth() + 1;
  const mm = m < 10 ? '0' + m : m;
  const d = today.getDate();
  const day = d < 10 ? '0' + d : d;
  const h = today.getHours();
  const hh = h < 10 ? '0' + h : h;
  const ms = today.getMinutes();
  const mins = ms < 10 ? '0' + ms : ms;
  const dateNow =
    mm + '/' + day + '/' + today.getFullYear() + ' ' + hh + ':' + mins;

  let paperType = 'LETTER';

  let reportTitle = 'BUS SEAT REPORT';
  const from = selectedInstitution ? selectedInstitution.institutionId : '????'; // FIXME: What to do when no inst selected
  const dest = selEndorsedTo ? selEndorsedTo : 'ALL';

  const fileName = `BusSeat_${dest}_${today.toISOString()}.pdf`;

  const dd = {
    defaultStyle: {
      fontSize: 11,
    },

    pageSize: paperType, // 'LETTER'
    pageOrientation: 'PORTRAIT',
    pageMargins: [25, 25, 25, 25],

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
            text: dateNow, //'02/11/2021 08:08:08 AM',
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
            text: reportTitle,
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
            text: 'Endorsed To : ' + dest,
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
              widths: ['*', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  {
                    text: 'Level',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    text: 'Scheduled',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    text: 'UnScheduled',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    text: 'Hold',
                    style: 'tblHeader',
                    border: [false, true, false, true],
                  },
                  {
                    text: 'Total',
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

  console.log('createBusSeatPDF(): dd => ', dd);
  pdfMake.createPdf(dd).download(fileName);
};

// createBusSeat()
// Builds data for Bus Seat report
// Calls createBusSeatPDF(data) to generate PDF report file
// ********************************
const createBusSeat = async (selEndorsedTo) => {
  try {
    const data = [];
    const objOfDestinations = await _buildObjOfDestinations(selEndorsedTo);
    console.log('objOfDestinations: ', objOfDestinations);

    // Loop through all destinations to build the pdf
    for (const destination in objOfDestinations) {
      console.log(`Building ${destination}`);
      data.push(_buildDestination(objOfDestinations[destination]));
      data.push(_buildSecurityLevels(objOfDestinations[destination].levels));
      data.push(_buildTotals(objOfDestinations[destination].totals));
    }

    console.log('createBusSeat(): data => ', data);
    if (data.length) {
      _createBusSeatPDF(data, selEndorsedTo);
    } else {
      // error message
      alert('Could not create CDCR Bus Seat Report PDF Document!');
    }
  } catch (ex) {
    console.error('createBusSeat() exception: ', ex);
  }
};

export default createBusSeat;
