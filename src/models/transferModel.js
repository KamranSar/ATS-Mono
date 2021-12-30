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
  currentEndorsementDate = null,
  originalEndorsementDate = null,
  expirationEndorsementDate = null,
  transferDate = null,
  schedule = '',
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
    currentEndorsementDate,
    originalEndorsementDate,
    expirationEndorsementDate,
    transferDate,
    schedule,
    transferReasonCode,
    transferReasonDesc,
    cdcr135Comments,
    inHouseRemarks,
    isTransferred,
    isScheduled,
  };
}

export default transferModel;
