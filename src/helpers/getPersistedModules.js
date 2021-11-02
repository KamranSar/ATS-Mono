import storeModules from '@/store/modules/index.js';

const AVAILABLE_MEDIUMS = [
  'localstorage',
  'sessionstorage',
  'cookies',
  'indexeddb',
];

/**
 * Queries for all the modules persisted by the type passed in.
 * IF the type passed in is invalid, an empty array is returned
 * @param {String} type The storage type
 * @returns {Array} An array of strings with all the module names persisted in the type.
 */
const getPersistedModules = (type) => {
  const modules = [];
  if (typeof type !== 'string') {
    return modules;
  }

  type = type.toLowerCase();
  if (!AVAILABLE_MEDIUMS.includes(type)) {
    return modules;
  }

  for (const m in storeModules) {
    if (Object.hasOwnProperty.call(storeModules, m)) {
      const module = storeModules[m];
      if (
        module &&
        module.persisted &&
        module.persisted.toLowerCase() === type
      ) {
        modules.push(m);
      }
    }
  }

  return modules;
};

export default getPersistedModules;
