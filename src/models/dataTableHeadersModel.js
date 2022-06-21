import DataTableHeader from '@/classes/DataTableHeader';

function dataTableHeadersModel(headers = new Array()) {
  headers = headers.map((h) => new DataTableHeader(h));
  return headers;
}

export default dataTableHeadersModel;
