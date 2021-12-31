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
  currentEndorsementDate = null,
  originalEndorsementDate = null,
  expirationEndorsementDate = null,
  schedule = '',
  scheduleId = '',
  transferDate = null,
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
    currentEndorsementDate,
    originalEndorsementDate,
    expirationEndorsementDate,
    schedule,
    scheduleId,
    transferDate,
    transferReasonCode,
    transferReasonDesc,
    cdcr135Comments,
    inHouseRemarks,
    isTransferred,
    isScheduled,
  };
}

export default transferModel;
