// mongoseservice_v1-model.js - A mongoose model
//
const mongoose = require('mongoose');

// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'destinations'; // TODO: Change this name to match your service name but remove the version number
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      institutionId: { type: String, required: true, index: { unique: true } },
      institutionName: { type: String, required: false, default: '' },
      institutionPartyId: { type: String, required: true, default: '999999999' },
      createdBy: { type: mongoose.ObjectId, required: true }, // The user who made the last change
      updatedBy: { type: mongoose.ObjectId, required: true }, // The user who made the last change
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
