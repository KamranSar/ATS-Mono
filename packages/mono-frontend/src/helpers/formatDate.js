import { LWOP_DATE, CONDEMNED_DATE, TBD_DATE } from '@/helpers/constants';

const formatDate = (item) => {
  // 2022-06-07
  const y = item.substr(0, 4);
  const m = item.substr(5, 2);
  const d = item.substr(8, 2);
  let result = m + '/' + d + '/' + y;
  if (item === LWOP_DATE) {
    result += '\n(LWOP)';
  } else if (item === CONDEMNED_DATE) {
    result += '\n(Condemned)';
  }
  if (item === TBD_DATE) {
    result += '\n(TBD)';
  }

  return result;
};

export default formatDate;
