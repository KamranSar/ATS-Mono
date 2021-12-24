/* eslint-disable no-unused-vars */
const serviceName = require('path').basename(__filename, '.impl.js');
const debug = require('debug')(`${process.env.APP_NAME}:src:services:${serviceName}:${serviceName}.impl`);
/**
 * Example function
 * @param {Object} app Feathers app
 * @returns Some return
 */
async function exampleFunction(options, params, id) {
  const host = options.app.get('host');

  if (id)
    return {
      id,
      host: host,
      text: `A new message with ID: ${id}!`,
    };
  else {
    params.query = Object.keys(params.query).length ? params.query : { allForOne: '1' };
    const formattedResp = {
      total: 1,
      limit: options.paginate.default,
      skip: 0,
      data: [{
        host: host,
        text: `A new paginated message for: ${JSON.stringify(params.query).replace(/["]+/g, '')}!`
      }]
    };
    return formattedResp;
  }
}

module.exports = { exampleFunction };
