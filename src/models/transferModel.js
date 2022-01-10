/**
 * This model represents what a Transfer should look like.
 *
 * ! This follows the backend schema (mongoose)
 */
function transferModel({
  offenderId = '',
  cdcrNumber = '',
  firstName = '',
  lastName = '',
  ethnicity = '',
  securityLevel = '',
  tbCode = '',
  caseFactor = '',
  releaseDate = null,
  transferDate = null,
  currentEndorsementDate = null,
  originalEndorsementDate = null,
  expirationEndorsementDate = null,
  schedule = '',
  scheduleId = '',
  transferReasonCode = '',
  transferReasonDesc = '',
  cdcr135Comments = '',
  inHouseRemarks = '',
  isTransferred = false,
  isScheduled = false,
} = {}) {
  return {
    offenderId,
    cdcrNumber,
    firstName,
    lastName,
    ethnicity,
    securityLevel,
    tbCode,
    caseFactor,
    releaseDate,
    transferDate,
    currentEndorsementDate,
    originalEndorsementDate,
    expirationEndorsementDate,
    schedule,
    scheduleId,
    transferReasonCode,
    transferReasonDesc,
    cdcr135Comments,
    inHouseRemarks,
    isTransferred,
    isScheduled,
  };
}

export default transferModel;
