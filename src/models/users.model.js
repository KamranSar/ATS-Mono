//
// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');

  const schema = new mongooseClient.Schema(
    {
      // DO NOT MODIFY THIS RECORD.
      // THE AUTH SERVER CONTROLS THIS RECORD DEFINITION
      azureLocalAccountId: { type: String },
      username: { type: String },
      password: { type: String },
      // Only the Auth server has a full list and allows updates to the user objext
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
