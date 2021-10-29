// mongoseservice_v1-model.js - A mongoose model
//
const mongoose = require('mongoose');

// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'schedule'; // TODO: Change this name to match your service name but remove the version number
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      departingInstitution: { type: String, required: true, default: null },
      schedule: { type: String, index: { unique: false }, required: true, default: null },
      destination: { type: String, required: true, default: null },
      // destination should be the same field as endorsedToSecurityLevel
      vias: [
        {
          type: String,
          default: null,
        },
      ],
      transferDate: { type: Date, required: true, default: null },
      seats: { type: Number, required: true, default: null },
      remainingSeats: { type: Number, default: null },
      transferComplete: { type: Boolean, default: null },
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
