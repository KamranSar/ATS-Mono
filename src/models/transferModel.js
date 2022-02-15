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
  housing = '',
  securityLevel = '',
  tbCode = '',
  caseFactor = '',
  releaseDate = null,
  transferDate = null,
  currentEndorsementDate = null,
  originalEndorsementDate = null,
  expirationEndorsementDate = null,
  title = '',
  scheduleId = null,
  transferReasonCode = '',
  transferReasonDesc = '',
  comments = '',
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
    housing,
    securityLevel,
    tbCode,
    caseFactor,
    releaseDate,
    transferDate,
    currentEndorsementDate,
    originalEndorsementDate,
    expirationEndorsementDate,
    title,
    scheduleId,
    transferReasonCode,
    transferReasonDesc,
    comments,
    inHouseRemarks,
    isTransferred,
    isScheduled,
  };
}

export default transferModel;
