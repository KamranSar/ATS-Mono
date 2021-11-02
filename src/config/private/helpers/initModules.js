import store from '@/store/index.js';
import modules from '@/store/modules/index.js';

const TIMER_LABEL = 'Vuex initiailized in';

/**
 * These modules are required by the template,
 * without them the template may not function properly.
 */
const _REQUIRED_MODULES = ['users', 'app', 'userPrefs', 'devicePrefs'];
_REQUIRED_MODULES.forEach((m) => {
  if (!Object.keys(modules).includes(m)) {
    console.error(
      `[vue-frontend-template] A required vuex module is missing: ${m}`
    );
  }
});

const initModules = async (ORDERED_MODULES) => {
  console.time(TIMER_LABEL);
  const promiseArray = [];
  let initModules = [
    ..._REQUIRED_MODULES,
    ...ORDERED_MODULES,
    ...Object.keys(modules).filter(
      (module) =>
        !['index', ..._REQUIRED_MODULES, ...ORDERED_MODULES].includes(module)
    ),
  ];
  console.groupCollapsed('Initializing vuex modules...');
  initModules.forEach((module) => {
    promiseArray.push(store.dispatch(`${module}/init`));
    console.log(`${module} module ready`);
  });
  await Promise.all(promiseArray);
  console.timeEnd(TIMER_LABEL);
  console.groupEnd();
};

export default initModules;
