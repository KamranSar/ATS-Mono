const { Service } = require('feathers-mongodb');

exports.ServiceClass = class ServiceClass extends Service {
  constructor(options, app) {
    super(options);
    
    app.get('mongoClient').then(db => {
      this.Model = db.collection('mongodbservice'); // FIXME: Change this to the database name for your service
    });
  }
};
