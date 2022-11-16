import feathers from '@cdcr/vue-frontend/feathers/index.js';
/**
 * This helper fetches all the results with a default $limit of 50.
 *
 * The default return type is 'JSON'
 *
 * @example Type: Array
 * const appUserRoles = await findAll('api/auth/v1/appuserroles', null, { type: 'Array'});
 * console.log({ appUserRoles })
 *
 * @example Type: Map
 * const appUserRoles = await findAll('api/auth/v1/appuserroles', null, { type: 'Array'});
 * console.log({ appUserRoles })
 * console.log([...results.keys()]) // To get all the keys
 * console.log([...results.values()]) // To get all the values
 *
 * @example Type: JSON
 * const { data } = await findAll('api/auth/v1/appuserroles', null, { type: 'JSON'});
 * console.log({ data })
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
const MIN_LIMIT = 50;
const MAX_LIMIT = 200;
const findAll = async (
  servicepath,
  query = null,
  options = {
    type: 'JSON', // Valid Types: "JSON", "Array", "Map"
  }
) => {
  try {
    if (!servicepath) throw Error('servicepath required');
    if (servicepath) {
      // If connection is REST
      if (servicepath.base && servicepath.name) {
        servicepath = servicepath.name;
        // if connection is Web socket
      } else if (servicepath.path) {
        servicepath = servicepath.path;
      }
    }
    // If service name starts with a slash, remove it to match what Feathers service names look like
    if (servicepath.startsWith('/')) {
      servicepath = servicepath.slice(1);
    }

    // // See if the service is actually registered with Feathers
    // let allServices = Object.keys(feathers.services) || [];
    // // Filtered out any interal apis not exposed
    // allServices = allServices.filter((api) => {
    //   if (api.includes(servicepath)) {
    //     return true;
    //   }
    //   return false;
    // });

    // if (!allServices || !allServices.length) {
    //   console.log(servicepath);
    //   throw Error(
    //     `${servicepath} service not registered in app when calling findAll`
    //   );
    // }

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
    if (!queryObject.query['$limit']) {
      queryObject.query['$limit'] = MIN_LIMIT;
    } else if (queryObject.query['$limit'] > MAX_LIMIT) {
      queryObject.query['$limit'] = MAX_LIMIT;
    }

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
    while (total > dataMap.size) {
      const response2 = await feathers.service(servicepath).find(queryObject);
      const data2 = response2.data;
      if (data2.length === 0) {
        break;
      }
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
  }
};

export default findAll;
