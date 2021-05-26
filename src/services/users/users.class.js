const { Service } = require('feathers-mongodb');

exports.ServiceClass = class ServiceClass extends Service {
  constructor(options, app) {
    super(options);

    app.get('midtierMongoClient').then((db) => {
      this.Model = db.collection('users');
    });
  }
};
