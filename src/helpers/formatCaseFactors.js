/**
 * Takes in the soms Offender object and returns the formated case factors from it.
 * @param {SomsOffender} item
 * @returns {String} case factors as a string
 */
const formatCaseFactors = (item) => {
  // console.log('formatCaseFactors(): item => ', item);
  const cf = [];
  // console.log(
  //   'formatCaseFactors(): lifer_lwop_flag => ',
  //   item.CaseFactors[0].lifer_lwop_flag
  // );
  if (item.CaseFactors[0].lifer_lwop_flag) {
    cf.push('sny: ' + item.CaseFactors[0].lifer_lwop_value);
  }
  // console.log(
  //   'formatCaseFactors(): sny_flag => ',
  //   item.CaseFactors[0].sny_flag
  // );
  if (item.CaseFactors[0].sny_flag) {
    cf.push('sny: ' + item.CaseFactors[0].sny_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].cccms_eop_flag
  // );
  if (item.CaseFactors[0].cccms_eop_flag) {
    cf.push('ccms-eop: ' + item.CaseFactors[0].cccms_eop_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].cocci1_flag
  // );
  if (item.CaseFactors[0].cocci1_flag) {
    cf.push('cocci1: ' + item.CaseFactors[0].cocci1_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].cocci2_flag
  // );
  if (item.CaseFactors[0].cocci2_flag) {
    cf.push('cocci2: ' + item.CaseFactors[0].cocci2_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].ddp_flag
  // );
  if (item.CaseFactors[0].ddp_flag) {
    cf.push('DDP: ' + item.CaseFactors[0].ddp_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].dpp_flag
  // );
  if (item.CaseFactors[0].dpp_flag) {
    cf.push('DPP: ' + item.CaseFactors[0].dpp_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].ice_flag
  // );
  if (item.CaseFactors[0].ice_flag) {
    cf.push('ice: ' + item.CaseFactors[0].ice_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].retainASU_flag
  // );
  if (item.CaseFactors[0].retainASU_flag) {
    cf.push('Retain ASU: ' + item.CaseFactors[0].retainASU_value);
  }
  // console.log(
  //   'formatCaseFactors(): item => ',
  //   item.CaseFactors[0].transferMERD_flag
  // );
  if (item.CaseFactors[0].transferMERD_flag) {
    cf.push('MERD: ' + item.CaseFactors[0].transferMERD_value);
  }
  return cf.join(', ');
};

export default formatCaseFactors;
