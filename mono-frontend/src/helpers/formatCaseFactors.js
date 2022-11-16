const CASE_FACTORS = {
  /* key: { 
    prefix: String // Included if `value` is Boolean
    value: String,
    forDisplay: Boolean, // If true, the Case Factors will NOT show up with the prefix
  }, */
  lifer_lwop_flag: {
    prefix: 'lwop:',
    value: 'lifer_lwop_value',
  },
  sny_flag: { prefix: 'sny:', value: 'sny_value' },
  // cccms_eop_flag: { prefix: 'ccms-eop', value: 'cccms_eop_value' }, // cccms_eop_flag is NOT displayed in Transfer or Endorsements page
  cocci1_flag: { prefix: 'cocci1:', value: 'cocci1_value' },
  cocci2_flag: { prefix: 'cocci2:', value: 'cocci2_value' },
  ddp_flag: { prefix: 'ddp:', value: 'ddp_value' },
  dpp_flag: { prefix: 'dpp:', value: 'dpp_value' },
  ice_flag: { prefix: 'ice:', value: 'ice_value' },
  retainASU_flag: {
    prefix: 'retain asu:',
    value: 'retainASU_value',
  },
  transferMERD_flag: {
    prefix: 'merd:',
    value: 'transferMERD_value',
  },
};

/**
 * Takes in the soms Offender object and returns the formated case factors from it.
 * @param {SomsOffender} item
 * @returns {String} case factors as a string
 */
const formatCaseFactors = (item) => {
  if (!item) return;
  // Coming from offender_detail case factors are in an  array called `CaseFactors`
  const offendersCF = item && item.CaseFactors ? item.CaseFactors : [];
  const cf = [];

  Object.keys(CASE_FACTORS).forEach((key) => {
    const items = offendersCF[0];
    const itemFlag = items[key];
    // if (key in offendersCF[0]) {
    // if (key in items) {
    if (itemFlag) {
      const cfValue = CASE_FACTORS[key].value;
      const caseFactorValue = `${CASE_FACTORS[key].prefix} ${
        // offendersCF[CASE_FACTORS[key].value]
        items[cfValue]
      }`;
      cf.push(caseFactorValue);
    }
  });

  return cf.join(', ');
};

export default formatCaseFactors;

export { CASE_FACTORS, formatCaseFactors };
