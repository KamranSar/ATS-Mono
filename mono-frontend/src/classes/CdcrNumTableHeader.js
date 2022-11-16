import DataTableHeader from '@/classes/DataTableHeader';

class CdcrNumTableHeader extends DataTableHeader {
  constructor(
    item = {
      text: 'CDCR #',
      align: 'start',
      value: 'cdcrNumber',
      router: function (item, value) {
        return {
          name: 'Transfer Details',
          params: {
            cdcrNumber: item[value],
          },
          title: item[value],
        };
      },
    }
  ) {
    super(item);
  }
}

export default CdcrNumTableHeader;
