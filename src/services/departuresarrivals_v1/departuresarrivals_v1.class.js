// const transfer_v1Service = require('../transfer_v1/transfer_v1.service');

/* eslint-disable no-unused-vars */
const serviceName = require('path').basename(__filename, '.class.js');
const { exampleFunction } = require(`./${serviceName}.impl.js`);
const omit = require('lodash.omit');

exports.ServiceClass = class ServiceClass {
  constructor(options, app) {
    this.options = options || {};
    this.options.app = app;
  }

  async find(params) {
    // const someReturn = await exampleFunction(this.options, params, null);
    const scheduleService = this.options.app.service('api/ats/v1/schedule');
    // add more code
    const transferService = this.options.app.service('api/ats/v1/transfer');

    const transfers = [];
    params.paginate = false;
    const ret = await scheduleService.find(params);
    console.log('departuresarrivals scheduleService.find(): response => ', ret);
    console.log('departuresarrivals: params => ', params);
    for (let x of ret) {
      let filter = {
        paginate: false,
        query: {
          scheduleId: x._id,
        },
        headers: params.headers,
      };
      x.transfers = await transferService.find(filter);
      console.log('departuresarrivals transferService.find(): response => ');
      console.log('departuresarrivals: params => ', filter);
      for (let y of x.transfers) {
        y.transferId = y._id;
        const v = omit({ ...y, ...x }, ['_id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'transfers', '__v']);
        transfers.push(v);
      }
    }

    const response = {
      total: transfers.length,
      limit: Number.parseInt(
        params.query.$limit
          ? params.query.$limit <= this.options.paginate.max
            ? params.query.$limit
            : this.options.paginate.max
          : this.options.paginate.default
      ),
      skip: Number.parseInt(params.query.$skip || 0),
      data: [],
    };

    response.data = transfers.splice(response.skip, response.limit);

    return response;
    // return ret;
    //return transfers;
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
