/**
 * This model represents what a Schedule should look like.
 *
 * ! This follows the backend schema (mongoose)
 */
function scheduleModel({
  origin = '',
  originId = '',
  destination = '',
  title = '',
  vias = [],
  transferDate = null,
  seats = 0,
} = {}) {
  return {
    origin,
    originId,
    destination,
    title,
    vias,
    transferDate,
    seats,
  };
}

export default scheduleModel;
