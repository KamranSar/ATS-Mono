import feathers from '@/config/private/feathers.js';
import store from '@/store';
/**
 * @param {String} servicepath - The service path of your API end point. Ex. /api/auth/v1/appuserroles
 * @param {Number=2} limit - The number of records to return at a time. Default: 2
 * @param {String=_id} key - The id field in the record to set as the key in the Map returned. Default=_id
 */
const findAll = async (servicepath, limit = 2, key = '_id') => {
  // Call once explitly to get total;
  let dataMap = new Map();
  store.set('app/loading', true);
  const response = await feathers.service(servicepath).find({
    query: {
      $limit: limit,
    },
  });
  const { data } = response;
  const { total } = response;
  data.forEach((role) => {
    dataMap.set(role[key], role);
  });

  // Are we missing any?
  while (total !== dataMap.size) {
    const response2 = await feathers.service(servicepath).find({
      query: {
        $limit: limit,
        $skip: dataMap.size,
      },
    });
    const data2 = response2.data;
    data2.forEach((role) => {
      dataMap.set(role._id, role);
    });
  }

  store.set('app/loading', false);
  return dataMap;
};

export default findAll;
