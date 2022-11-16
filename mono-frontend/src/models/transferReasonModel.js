/**
 * This model represents what a Transfer Reason should look like.
 *
 */
function transferReasonModel({ reasonCode = '', reasonDesc = '' } = {}) {
  return {
    reasonCode,
    reasonDesc,
  };
}

export default transferReasonModel;
