---
to: "src/feathers/services/<%= h.changeCase.lower(name) %>/<%= h.changeCase.lower(name) %>.hooks.js"
---
// import { myApp } from '@/config/myApp.js';

/**
 * @param {*} context
 * @returns context
 */
async function exampleHook(context) {
  /**
   * Do something with your context here...
   * console.log("context: ", context)
   */

  return context;
}

export { exampleHook };


