/* eslint-disable no-unused-vars */
const serviceName = require('path').basename(__filename, '.impl.js');
const debug = require('debug')(`${process.env.APP_NAME}:src:services:${serviceName}:${serviceName}.impl`);
const { GeneralError, BadRequest } = require('@feathersjs/errors');
const { readSQLFiles, validateQueryParameters } = require('cdcrhelpers');
const queryJSON = require(`./${serviceName}.qp.json`);

//
// Load the SQL queries
//
let arySqlFiles = [
  'people',
  'cats',
  'dogs',
];
let aryQueries = [];
readSQLFiles(__dirname + '/sql/', arySqlFiles)
  .then(results => aryQueries = results)
  .catch(/* Should never get here */);

//
// Run the various SQL queries and format the response
//
async function runQuery(options, params) {

  debug('runQuery: Begin - using query params:', params.query, ' and pagination:', options.paginate);
  //
  // Get a database connection
  //
  const db = options.app.get('oracleClient');

  //
  // Create an empty response
  //
  const formattedResp = {
    total: 0,
    limit: options.paginate.default,
    skip: 0,
    data: []
  };

  //
  // Get the query parameters & place in an "array of strings"
  // Set the query parameter values to empty string if missing
  //
  // -- lastname: required
  // -- firstname: required
  //
  const aryStrVal1 = [
    params.query.lastname || '',
    params.query.firstname || ''
  ];

  //
  // Validate the query parameters
  //
  const { paramsTestResult, failMsg, passMsg } = validateQueryParameters(queryJSON, params.query, true);
  if (!paramsTestResult)
    throw new BadRequest('runQuery: missing required query parameters');


  //
  // Execute the query with the parameters
  //
  try {
    const results1 = await db.raw(aryQueries['people'], [...aryStrVal1]); // Ratio 1:1
    // If person not found, then return an empty payload
    if (!Array.isArray(results1) || results1.length < 1) {
      debug('runQuery: End');
      // debug(`runQuery: End - response: ${JSON.stringify(formattedResp)}`); 
      return formattedResp;
    }

    // Pull out value of ID column and use for searching Dogs & Cats tables.
    // Must place value in an "array of strings" for knex query.
    const { ID } = results1[0];
    const aryStrVal2 = [String(ID)];

    // Execute secondary queries using foreign key lookup
    const promiseArray = [];
    promiseArray.push(db.raw(aryQueries['cats'], [...aryStrVal2])); // Ratio 1:*
    promiseArray.push(db.raw(aryQueries['dogs'], [...aryStrVal2])); // Ratio 1:*
    // Wait for all queries to finish
    const [cats, dogs] = await Promise.all(promiseArray);
    // Format the response buffer in to a valid JSON document
    formattedResp.data =
      JSON.parse('[' +

        JSON.stringify(Object.assign(
          {},
          results1[0], // queryPeople 1:1
          { cats: cats }, // queryCats 1:*
          { dogs: dogs })) // queryDogs 1:*

        + ']');

    formattedResp.total = results1.length;
    debug('runQuery: End');
    // debug(`runQuery: End - response: ${JSON.stringify(formattedResp)}`); 
    return formattedResp;

  } catch (ex) {
    throw new GeneralError(`runQuery: Error executing SQL query - Error = ${ex}`);
  }
}


module.exports = { runQuery };
