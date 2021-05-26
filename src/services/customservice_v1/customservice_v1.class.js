/* eslint-disable no-unused-vars */
const serviceName = require('path').basename(__filename, '.class.js');
const { exampleFunction } = require(`./${serviceName}.impl.js`);

exports.ServiceClass = class ServiceClass {
  constructor(options, app) {
    this.options = options || {};
    this.options.app = app;
  }

  async find(params) {
    const someReturn = await exampleFunction(this.options, params, null);
    return someReturn;
  }

  async get(id, params) {
    const someReturn = await exampleFunction(this.options, null, id);
    return someReturn;
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
