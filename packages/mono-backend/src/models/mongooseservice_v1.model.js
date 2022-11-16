// mongoseservice_v1-model.js - A mongoose model
//
const mongoose = require('mongoose');

// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'mongoseservice'; // TODO: Change this name to match your service name but remove the version number
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      // TODO: Modify these to match your desired database layout.  _id is not needed since mongodb automatically adds it. Remove this comment when done
      text: { type: String, required: true, index: { unique: true } },
      someother: { type: String, required: false, default: '' },
      some_boolean_field: { type: Boolean, required: false, default: false },
      some_number_field: { type: Number, required: false, default: 0 },
      some_nullable_field: { type: String, required: false, default: null },
      updatedBy: { type: mongoose.ObjectId, required: true }, // The user who made the last change.  Leave this field here for security purposes
    },
    {
      timestamps: true, // This adds creadtedAt and updatedAt fields.
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
