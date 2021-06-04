const { Service } = require('feathers-mongodb');
const serverInfo = require('../../service-config').server;

exports.ServiceClass = class ServiceClass extends Service {
  constructor(options, app) {
    super(options);

    if (serverInfo.mongodbEnabled) {
      const dbCollectionName = 'mymongocollection'; // TODO: Change this to the database collection name for your service and remove this comment

      app.get('mongoClient').then((db) => {
        this.Model = db.collection(dbCollectionName);
      });
    }
  }
};
