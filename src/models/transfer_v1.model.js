// mongoseservice_v1-model.js - A mongoose model
//
const mongoose = require('mongoose');

// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'transfers'; // TODO: Change this name to match your service name but remove the version number
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      // ATS Fields
      cdcrNumber: { type: String, required: true, index: { unique: false } },
      firstName: { type: String, required: false, default: '' },
      lastName: { type: String, required: false, default: '' },
      institutionName: { type: String, required: false, default: '' },
      institutionId: { type: String, required: false, default: '' },
      institutionPartyId: { type: String, required: false, default: '' },
      releaseDate: { type: Date, required: false, default: null },
      ethnicity: { type: String, required: false, default: '' },
      housing: { type: String, required: false, default: '' },
      securityLevel: { type: String, required: false, default: '' },
      tbCode: { type: String, required: false, default: '' },
      caseFactor: { type: String, required: false, default: '' },
      originalEndorsementDate: { type: Date, required: false, default: null },
      currentEndorsementDate: { type: Date, required: false, default: null }, // Needs to be labeled as Current Endorsement Date
      expirationEndorsementDate: { type: Date, required: false, default: null },
      endorsedToName: { type: String, required: false, default: '' },
      endorsedToId: { type: String, required: false, default: '' },
      endorsedToPartyId: { type: String, required: false, default: '' },
      transferDate: { type: Date, required: false, default: null },
      scheduleId: { type: mongoose.ObjectId, required: false, default: null },
      isScheduled: { type: Boolean, required: false, default: false },
      isTransferred: { type: Boolean, required: false, default: false },
      transferReasonCode: { type: String, required: false, default: '' },
      transferReasonDesc: { type: String, required: false, default: '' },
      comments: { type: String, default: '' },
      inHouseRemarks: { type: String, default: '' },
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
