const SOMS_DATA_FIELDS = (somsOffender) => [
  {
    label: 'CDCR Number:',
    data:
      somsOffender && somsOffender.cdcrNumber ? somsOffender.cdcrNumber : '',
  },
  {
    label: 'Offender ID:',
    data:
      somsOffender && somsOffender.offenderId ? somsOffender.offenderId : '',
  },
  {
    label: 'Arrival Date:',
    data:
      somsOffender && somsOffender.arrivalDate ? somsOffender.arrivalDate : '',
  },
  {
    label: 'Release Date:',
    data:
      somsOffender && somsOffender.releaseDate ? somsOffender.releaseDate : '',
  },
  {
    label: 'Release Type:',
    data:
      somsOffender && somsOffender.releaseType ? somsOffender.releaseType : '',
  },
  {
    divider: true,
  },
  {
    label: 'Housing:',
    data:
      somsOffender && somsOffender.housingArea ? somsOffender.housingArea : '',
  },
  {
    label: 'Security Level:',
    value:
      somsOffender && somsOffender.securityLevel
        ? somsOffender.securityLevel
        : '',
  },
  {
    divider: true,
  },
  {
    label: 'Ethnicity:',
    data: somsOffender && somsOffender.ethnicity ? somsOffender.ethnicity : '',
  },
  {
    label: 'TB Code:',
    data: somsOffender && somsOffender.tbCode ? somsOffender.tbCode : '',
  },
  {
    label: 'Mental Health:',
    data: somsOffender && somsOffender.Mental ? somsOffender.Mental : '',
  },
  {
    label: 'Override Reason: ',
    data:
      somsOffender && somsOffender.overrideReason
        ? somsOffender.overrideReason
        : '',
  },
];

const COMMENT_FIELDS = (somsOffender) => [
  {
    divider: true,
  },
  {
    label: 'CDC 135/Status Report Comments',
    data:
      somsOffender && somsOffender.cdcr135Comments
        ? somsOffender.cdcr135Comments
        : '',
  },
  {
    label: 'In-House Remarks',
    data:
      somsOffender && somsOffender.inHouseRemarks
        ? somsOffender.inHouseRemarks
        : '',
  },
];

const CASE_FACTOR_FIELDS = (somsOffender) => {
  var caseFactor =
    somsOffender && somsOffender.CaseFactors && somsOffender.CaseFactors.length
      ? somsOffender.CaseFactors[0]
      : null;
  return [
    {
      label: 'SNY:',
      data: caseFactor && caseFactor.sny_flag ? 'Y' : 'N',
    },
    {
      label: 'CCMS EOP:',
      value:
        caseFactor && caseFactor.cccms_eop_value
          ? caseFactor.cccms_eop_value
          : '',
      data: caseFactor && caseFactor.cccms_eop_flag ? 'Y' : 'N',
    },
    {
      label: 'Cocci1:',
      value:
        caseFactor && caseFactor.cocci1_value ? caseFactor.cocci1_value : '',
      data: caseFactor && caseFactor.cocci1_flag ? 'Y' : 'N',
    },
    {
      label: 'Cocci2:',
      value:
        caseFactor && caseFactor.cocci2_value ? caseFactor.cocci2_value : '',
      data: caseFactor && caseFactor.cocci2_flag ? 'Y' : 'N',
    },
    {
      label: 'DPP:',
      value: caseFactor && caseFactor.dpp_value ? caseFactor.dpp_value : '',
      data: caseFactor && caseFactor.dpp_flag ? 'Y' : 'N',
    },
    {
      label: 'DDP:',
      value: caseFactor && caseFactor.ddp_value ? caseFactor.ddp_value : '',
      data: caseFactor && caseFactor.ddp_flag ? 'Y' : 'N',
    },
    {
      label: 'ICE:',
      value: caseFactor && caseFactor.ice_value ? caseFactor.ice_value : '',
      data: caseFactor && caseFactor.ice_flag ? 'Y' : 'N',
    },
    {
      label: 'Retain ASU:',
      value:
        caseFactor && caseFactor.retainASU_value
          ? caseFactor.retainASU_value
          : '',
      data: caseFactor && caseFactor.retainASU_flag ? 'Y' : 'N',
    },
    {
      label: 'Transfer MERD:',
      value:
        caseFactor && caseFactor.transferMERD_value
          ? caseFactor.transferMERD_value
          : '',
      data: caseFactor && caseFactor.transferMERD_flag ? 'Y' : 'N',
    },
  ];
};

const ENDORSEMENT_FIELDS = (somsOffender) => [
  { divider: true },
  {
    label: 'Endorsed To: ',
    data:
      somsOffender && somsOffender.institution ? somsOffender.institution : '',
  },
  { break: true },
  {
    label: 'Original Date: ',
    data:
      somsOffender && somsOffender.originalEndorsementDate
        ? somsOffender.originalEndorsementDate
        : '',
  },
  { break: true },
  {
    label: 'Current Date: ',
    data:
      somsOffender && somsOffender.endorseDate ? somsOffender.endorseDate : '',
  },
  { break: true },
  {
    label: 'Expiration Date: ',
    data:
      somsOffender && somsOffender.expirationEndorsementDate
        ? somsOffender.expirationEndorsementDate
        : '',
  },
];

export {
  SOMS_DATA_FIELDS,
  COMMENT_FIELDS,
  CASE_FACTOR_FIELDS,
  ENDORSEMENT_FIELDS,
};
