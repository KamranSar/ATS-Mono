---
sidebar: auto
---

# Feathers Client

:::tip
Our middle tier service is built heavily on the backend framework feathers.
:::

We can utilize the `feathersClient` library to handle a lot of our requests without the need of `axios`.

## Service Files

All of our services can be explicitly called via their service path **_OR_** used directly with their service file in `@/feathers/services/...`.

- **Usage With:**

```js
import ExampleService from '@/feathers/services/example/example.service.js';

ExampleService.find({
  query: {
    foo: 'bar',
  },
});

ExampleService.get(userID);
```

- **Usage Without:**

```js
this.$feathers.service('/api/example/v1/foobar/').find({
  query: {
    foo: 'bar',
  },
});

this.$feathers.service('/api/example/v1/foobar/').get(userID);
```

### Example Feathers Hook

```js
// @/feathers/services/example/example.hooks.js;

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
```

### Full Example Feathers Hook

:::tip
Hooks are useful when you're trying to apply something before or after all of your find or get methods.
:::

<center><i>...or any feathers method for that matter</i></center>

```js
/**
 * @name addDownloadedAtTS
 *
 * Adds the `downloadedAt` field to the returned data objects.
 *
 * @example
 * service.hooks({
 *   after: {
 *     all: [],
 *     find: [addDownloadedAtTS],
 *     get: [],
 *     create: [],
 *     update: [],
 *     patch: [],
 *     remove: [],
 *   }
 * });
 *
 * @param {*} context
 * @returns context
 */
async function addDownloadedAtTS(context) {
  if (context && context.result && context.result.data.length) {
    const resultData = context.result.data;
    resultData.forEach((data) => {
      data.downloadedAt = Date.now();
    });
  }
  return context;
}
```

### Example Feathers Service

```js
// @/feathers/services/example/example.service.js;

import feathersClient from '@/feathers/index.js';
import { debug } from 'feathers-hooks-common';
import { WEB_SOCKETS_ENABLED } from '@/config/appFeatures.js';

// If you've enabled sockets in myApp config...
// Toggle this to true or false to watch for service changes on the socket.
const watchForChangesOnSocket = true;
import { exampleHook } from '@/feathers/services/example/example.hooks.js';

const servicePath = 'api/auth/v1/example';
const service = feathersClient.service(servicePath);
service.hooks({
  before: {
    all: [debug('Hello World Example!'), exampleHook],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

// Listen to socket events when available.
if (WEB_SOCKETS_ENABLED && watchForChangesOnSocket) {
  service.on('created', (item) => {
    console.log('Created: ', item);
  });
  service.on('updated', (item) => {
    console.log('Updated: ', item);
  });
  service.on('patched', (item) => {
    console.log('Patched: ', item);
  });
  service.on('removed', (item) => {
    console.log('Removed: ', item);
  });
}

// Feathers Service
export default service;
```

You can import the example hook into a service file.

## Javascript Helpers

### findAll

This helper is useful when fetching all the records from a collection but run into the **$limit** of 50 in feathers.

- **Type:** `Function`
- **Param 1:** `String | ServiceObject` The path to your service as derived from our `services` array in [`service-config.js`](https://dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/database-template?path=%2Fsrc%2Fservice-config.js) or the service defined in `@/feathers/services/`.
- **Param 2:** `Object` The feathers query object which can be read further on [here](https://docs.feathersjs.com/api/databases/querying.html).
- **Param 3:** `Object` The options to determine the return type.
- **Returns:** `Any` Returns the response in the type passed in or JSON by default.
- **Location:** `@/feathers/helpers/findAll.js`
- **Usage:**

```js
import findAll from '@/feathers/helpers/findAll.js';
import ExampleService from '@/feathers/services/example/example.service.js';

/**
 * Array: Will return just the response.data
 * JSON: Will return response object with all the fetche data in the `data` array.
 * Map: Will return a mapped set keyed to the index.
 */
const appUserRoles = await findAll('/api/auth/v1/appuserroles', null, {
  type: 'Array', // Valid Options Are: 'Array', 'JSON', 'Map'
});
console.log({ appUserRoles });

const fooBar = await findAll(ExampleService, null); // Default type is JSON
console.log('fooBar Data: ', fooBar.data);
```

::: details
<<< @/../src/feathers/helpers/findAll.js
:::

## Resources

[Feathers Querying](https://docs.feathersjs.com/api/databases/querying.html)

[Feathers Methods](https://docs.feathersjs.com/api/services.html#service-methods)
