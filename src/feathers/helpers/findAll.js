import feathers from '@/feathers/index.js';
import store from '@/store';
/**
 * This helper fetches all the results with a default $limit of 50.
 *
 * The default return type is 'JSON'
 *
 * @example
 * const appUserRoles = await findAll('/api/auth/v1/appuserroles', null, { type: 'Array'});
 * console.log({ appUserRoles })
 *
 * @param {Object|String} servicepath - The service or path of your API end point.
 * @param {Object} query - A complete feathers query object. Ex. { query: { ... } }
 * @param {Object} [options={type: 'JSON'}] - Available options for return
 *
 * {
 *  type: "JSON", // Valid Types: "JSON", "Array", "Map"
 * }
 *
 * @returns {JSON|Array|Map} results
 */
const findAll = async (
  servicepath,
  query = null,
  options = {
    type: 'JSON', // Valid Types: "JSON", "Array", "Map"
  }
) => {
  try {
    store.set('app/loading', true);

    if (!servicepath) throw Error('servicepath required');

    if (servicepath && servicepath.base && servicepath.name) {
      servicepath = servicepath.name;
    }

    // *NOTE: It's easier to convert a Map to a JSON or Array.
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

    // Default it to 50
    queryObject.query['$limit'] = 50;

    // Call once explicitly to get the total;
    const response = await feathers.service(servicepath).find(queryObject);
    const { data } = response;
    const { total } = response;
    data.forEach((item) => {
      dataMap.set(dataMap.size, item);
    });

    // Start skipping the ones we've pulled
    queryObject.query['$skip'] = dataMap.size;

    // Keep fetching until we've mapped all of them
    while (total !== dataMap.size) {
      const response2 = await feathers.service(servicepath).find(queryObject);
      const data2 = response2.data;
      data2.forEach((item) => {
        dataMap.set(dataMap.size, item);
      });
      queryObject.query['$skip'] = dataMap.size;
    }

    switch (options.type.toUpperCase()) {
      case 'JSON':
        return {
          ...response, // Contains limit, skip, total
          data: [...dataMap.values()],
        };
      case 'MAP':
        return dataMap;
      case 'ARRAY':
        return [...dataMap.values()];
    }
  } catch (error) {
    console.error(`findAll(${servicepath})`, { query }, { error });
    switch (options.type.toUpperCase()) {
      case 'JSON':
        return {
          limit: null, // Contains limit, skip, total
          skip: null,
          total: null,
          data: [],
        };
      case 'MAP':
        return new Map();
      case 'ARRAY':
        return [];
    }
  } finally {
    store.set('app/loading', false);
  }
};

export default findAll;
