import feathers from '@/config/private/feathers.js';
import store from '@/store';
/**
 * This helper fetches all the results with a default $limit of 10.
 *
 * The return is a Map of the matched results
 *
 * To get all the keys: [...results.keys()]
 *
 * To get all the values: [...results.values()]
 *
 * @param {String} servicepath - The service path of your API end point. Ex. /api/auth/v1/appuserroles
 * @param {Object} query - A complete feathers query object. Ex. { query: { ... } }
 * @param {String} keyField - The id field in the record to set as the key in the Map returned. Default=_id
 * @returns {Map} results - A map of keys storing each record
 */
const findAll = async (servicepath, query = null, keyField = '_id') => {
  try {
    store.set('app/loading', true);

    if (!servicepath) throw Error('servicepath required');

    // Create the dataMap to return
    let dataMap = new Map();

    // Build the query object
    let queryObject = {
      query: {},
    };

    // Add any queries passed in
    if (query && query.query && Object.keys(query.query).length) {
      Object.keys(query.query).forEach((q) => {
        queryObject.query[q] = query.query[q];
      });
    }

    // Check for a limit, default it to 10
    if (!queryObject.query.$limit) {
      queryObject.query['$limit'] = 10;
    }

    // Call once explicitly to get the total;
    const response = await feathers.service(servicepath).find(queryObject);
    const { data } = response;
    const { total } = response;
    data.forEach((role) => {
      dataMap.set(role[keyField], role);
    });

    // Start skipping the ones we've pulled
    queryObject.query['$skip'] = dataMap.size;

    // Keep fetching until we've mapped all of them
    while (total !== dataMap.size) {
      const response2 = await feathers.service(servicepath).find(queryObject);
      const data2 = response2.data;
      data2.forEach((role) => {
        dataMap.set(role._id, role);
      });
    }

    return dataMap;
  } catch (error) {
    console.error(`findAll(${servicepath})`, query, error);
    return new Map();
  } finally {
    store.set('app/loading', false);
  }
};

export default findAll;
