// formatDate(date)
// Formats Dates into mm/dd/yy format
//
const formatDate = (date, bShort = false) => {
  if (!date) return null;

  var szDate = new Date(date).toLocaleString('en-GB', { dateStyle: 'short' });
  // var yyyy = szDate.substr(0, 4); // 4 digit year
  var dd = szDate.substr(0, 2);
  var mm = szDate.substr(3, 2);
  var yy = bShort ? szDate.substr(8, 2) : szDate.substr(6, 4); // 2 digit or 4 digit year
  var strDate = `${mm}/${dd}/${yy}`;
  return strDate;
};

export default formatDate;
