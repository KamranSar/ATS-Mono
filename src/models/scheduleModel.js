/**
 * This model represents what a Schedule should look like.
 *
 * ! This follows the backend schema (mongoose)
 */
function scheduleModel({
  origin = '',
  destination = '',
  schedule = '',
  vias = [],
  transferDate = null,
  seats = 0,
} = {}) {
  return {
    origin,
    destination,
    schedule,
    vias,
    transferDate,
    seats,
  };
}

export default scheduleModel;
