// function getSecLvl(somsOffender) {
//   console.log('getSecLvl(): somsOffender => ', somsOffender);
//   console.log(
//     'getSecLvl(): somsOffender.securityLevel => ',
//     somsOffender.securityLevel
//   );
//   return somsOffender && somsOffender.securityLevel
//     ? somsOffender.securityLevel
//     : '';
// }
import store from '@/store';
import { LWOP_DATE, CONDEMNED_DATE, TBD_DATE } from '@/helpers/constants.js';

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
    data: _formatReleaseDate(
      somsOffender && somsOffender.releaseDate ? somsOffender.releaseDate : ''
    ),
    // somsOffender && somsOffender.releaseDate ? somsOffender.releaseDate : '',
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
    data:
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
  // {
  //   label: 'Mental Health:',
  //   data: somsOffender && somsOffender.mhLoc ? somsOffender.mhLoc : '',
  // },
  // {
  //   label: 'Override Reason: ',
  //   data:
  //     somsOffender && somsOffender.overrideReason
  //       ? somsOffender.overrideReason
  //       : '',
  // },
];

function _formatReleaseDate(data) {
  if (data === LWOP_DATE) {
    return '(LWOP) ' + data;
  } else if (data === CONDEMNED_DATE) {
    return '(Condemned) ' + data;
  }
  if (data === TBD_DATE) {
    return '(TBD) ' + data;
  }

  return data;
}

const COMMENT_FIELDS = (somsOffender) => [
  {
    divider: true,
  },
  {
    label: 'SOMS Comments',
    data: somsOffender && somsOffender.comments ? somsOffender.comments : '',
  },
  // {
  //   label: 'SOMS Remarks',
  //   data:
  //     somsOffender && somsOffender.inHouseRemarks
  //       ? somsOffender.inHouseRemarks
  //       : '',
  // },
];

const CASE_FACTOR_FIELDS = (somsOffender) => {
  var caseFactor =
    somsOffender && somsOffender.CaseFactors && somsOffender.CaseFactors.length
      ? somsOffender.CaseFactors[0]
      : null;
  return [
    {
      label: 'SNY:',
      data:
        caseFactor && caseFactor.sny_value && caseFactor.sny_flag
          ? caseFactor.sny_value
          : 'N',
    },
    // {
    //   label: 'CCCMS EOP:',
    //   value:
    //     caseFactor && caseFactor.cccms_eop_value
    //       ? caseFactor.cccms_eop_value
    //       : '',
    //   data: caseFactor && caseFactor.cccms_eop_flag ? 'Y' : 'N',
    // },
    {
      label: 'Cocci1:',
      // value:
      //   caseFactor && caseFactor.cocci1_value ? caseFactor.cocci1_value : '',
      // data: caseFactor && caseFactor.cocci1_flag ? 'Y' : 'N',
      data:
        caseFactor && caseFactor.cocci1_value && caseFactor.cocci1_flag
          ? caseFactor.cocci1_value
          : 'N',
    },
    {
      label: 'Cocci2:',
      // value:
      //   caseFactor && caseFactor.cocci2_value ? caseFactor.cocci2_value : '',
      // data: caseFactor && caseFactor.cocci2_flag ? 'Y' : 'N',
      data:
        caseFactor && caseFactor.cocci2_value && caseFactor.cocci2_flag
          ? caseFactor.cocci2_value
          : 'N',
    },
    {
      label: 'DPP:',
      // value: caseFactor && caseFactor.dpp_value ? caseFactor.dpp_value : '',
      // data: caseFactor && caseFactor.dpp_flag ? 'Y' : 'N',
      data:
        caseFactor && caseFactor.dpp_value && caseFactor.dpp_flag
          ? caseFactor.dpp_value
          : 'N',
    },
    {
      label: 'DDP:',
      // value: caseFactor && caseFactor.ddp_value ? caseFactor.ddp_value : '',
      // data: caseFactor && caseFactor.ddp_flag ? 'Y' : 'N',
      data:
        caseFactor && caseFactor.ddp_value && caseFactor.ddp_flag
          ? caseFactor.ddp_value
          : 'N',
    },
    {
      label: 'ICE:',
      // value: caseFactor && caseFactor.ice_value ? caseFactor.ice_value : '',
      // data: caseFactor && caseFactor.ice_flag ? 'Y' : 'N',
      data:
        caseFactor && caseFactor.ice_value && caseFactor.ice_flag
          ? caseFactor.ice_value
          : 'N',
    },
    {
      label: 'Retain ASU:',
      // value:
      //   caseFactor && caseFactor.retainASU_value
      //     ? caseFactor.retainASU_value
      //     : '',
      // data: caseFactor && caseFactor.retainASU_flag ? 'Y' : 'N',
      data:
        caseFactor &&
        caseFactor.retainASU_value &&
        caseFactor.retainASU_flag &&
        caseFactor.retainASU_flag === 'Y'
          ? caseFactor.retainASU_value
          : 'N',
    },
    {
      label: 'Transfer MERD:',
      // value:
      //   caseFactor && caseFactor.transferMERD_value
      //     ? caseFactor.transferMERD_value
      //     : '',
      // data: caseFactor && caseFactor.transferMERD_flag ? 'Y' : 'N',
      data:
        caseFactor &&
        caseFactor.transferMERD_value &&
        caseFactor.transferMERD_flag &&
        caseFactor.transferMERD_flag === 'Y'
          ? caseFactor.transferMERD_value
          : 'N',
    },
    {
      label: 'Mental Health:',
      data: somsOffender && somsOffender.mhLoc ? somsOffender.mhLoc : 'N',
    },
  ];
};

const ENDORSEMENT_FIELDS = (somsOffender) => [
  { divider: true },
  {
    label: 'Endorsed To: ',
    data:
      somsOffender &&
      somsOffender.endorsedInstitution &&
      somsOffender.endorsedProgram
        ? store.getters['institutions/getInstitutionByName'](
            somsOffender.endorsedInstitution
          ).institutionId +
          '-' +
          somsOffender.endorsedSecurityLevel +
          '(' +
          (somsOffender.endorsedProgram.toLowerCase() !== 'not applicable'
            ? somsOffender.endorsedProgram
            : 'NA') +
          ')'
        : '',
    // somsOffender && somsOffender.institution ? somsOffender.institution : '',
  },
  { break: true },
  {
    label: 'Original Date: ',
    data:
      somsOffender && somsOffender.signedDate ? somsOffender.signedDate : '',
  },
  { break: true },
  {
    label: 'Current Date: ',
    data:
      somsOffender && somsOffender.endorsedDate
        ? somsOffender.endorsedDate
        : '',
  },
  { break: true },
  {
    label: 'Expiration Date: ',
    data:
      somsOffender && somsOffender.expirationDate
        ? somsOffender.expirationDate
        : '',
  },
  { break: true },
  {
    label: 'Override Reason: ',
    data:
      somsOffender && somsOffender.overrideReason
        ? somsOffender.overrideReason
        : '',
  },
  { break: true },
  {
    label: 'Endorsement Type: ',
    data: somsOffender && somsOffender.formType ? somsOffender.formType : '',
  },
];

const NO_DATA_TEXT = 'Not endorsed to any schedules';

export {
  SOMS_DATA_FIELDS,
  COMMENT_FIELDS,
  CASE_FACTOR_FIELDS,
  ENDORSEMENT_FIELDS,
  NO_DATA_TEXT,
};
