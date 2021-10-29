// mongoseservice_v1-model.js - A mongoose model
//
const mongoose = require('mongoose');

// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'offendertransfer'; // TODO: Change this name to match your service name but remove the version number
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      // SOMS Offender API Fields
      offenderId: { type: String, required: true, default: null },
      cdcrNumber: { type: String, required: true, index: { unique: false }, default: null },
      lastName: { type: String, required: true, default: null },
      firstName: { type: String, required: true, default: null },
      middleName: { type: String, default: null },
      suffix: { type: String, default: null },
      dob: { type: Date, default: null },
      gender: { type: String, default: null },
      ethnicity: { type: String, default: null },
      location: { type: String, default: null },
      housingArea: { type: String, default: null },
      bed: { type: String, default: null },
      arrivalDate: { type: Date, default: null },
      tabeScore: { type: String, default: null },
      releaseDate: { type: Date, default: null },
      releaseType: { type: String, default: null },
      mhLoc: { type: String, default: null },
      formType: { type: String, default: null },
      auditType: { type: String, default: null },
      auditTypeDescription: { type: String, default: null },
      institution: { type: String, default: null },
      securityLevel: { type: String, default: null },
      program: { type: String, default: null },
      overrideReason: { type: String, default: null },
      endorseDate: { type: Date, default: null }, // Needs to be labeled as Current Endorsement Date
      expirationDate: { type: Date, default: null },
      comments: { type: String, default: null }, // Needs to be labeled as Auditor Comments
      HousingRestrictions: [
        {
          effectiveDate: { type: Date, default: null },
          expirationDate: { type: Date, default: null },
          housingRestriction: { type: String, default: null },
          housingRestrictionDescription: { type: String, default: null },
          housingRestrictionDurationType: { type: String, default: null },
        },
      ],
      TransferHolds: [
        {
          effectiveDate: { type: Date, default: null },
          expirationDate: { type: Date, default: null },
          holdType: { type: String, default: null },
          holdTypeDescription: { type: String, default: null },
          comments: { type: String, default: null },
        },
      ],
      PhysicalLimitations: [
        {
          effectiveDate: { type: Date, default: null },
          expirationDate: { type: Date, default: null },
          physicalLimitation: { type: String, default: null },
          physicalLimitationDescription: { type: String, default: null },
          physicalLimitationType: { type: String, default: null },
        },
      ],
      RulesViolations: [
        {
          violationDate: { type: Date, default: null },
          reportNumber: { type: String, default: null },
          violationCode: { type: String, default: null },
          rvrLevel: { type: String, default: null },
          rvrLevelDescription: { type: String, default: null },
          rvrStatus: { type: String, default: null },
          rvrStatusDescription: { type: String, default: null },
        },
      ],

      // ATS Fields
      originalEndorsementDate: { type: Date, default: null },
      transferDate: { type: Date, default: null },
      isTransfered: { type: Boolean, default: null },
      scheduleId: { type: mongoose.ObjectId, default: null }, // Schedule._id
      schedule: { type: String, default: null },
      isScheduled: { type: Boolean, default: null },
      transferReason: { type: String, default: null },
      vias: [
        {
          type: String,
          default: null,
        },
      ],
      cdcr135Comments: { type: String, default: null },
      inHouseRemarks: { type: String, default: null },
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