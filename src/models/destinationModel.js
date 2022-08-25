/**
 * This model represents what a Destination should look like.
 * This model get Concatenated to the listOfinstitutions in Schedule.vue
 * to provide additional destinations and vias to the schedules
 *
 */
function destinationModel({
  institutionId = '',
  institutionName = '',
  institutionPartyId = '',
} = {}) {
  return {
    institutionId,
    institutionName,
    institutionPartyId,
  };
}

export default destinationModel;
