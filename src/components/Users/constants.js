const HEADERS = [
  /*   {
  text: string,
  value: string,
  align?: 'start' | 'center' | 'end',
  sortable?: boolean,
  filterable?: boolean,
  groupable?: boolean,
  divider?: boolean,
  class?: string | string[],
  cellClass?: string | string[],
  width?: string | number,
  filter?: (value: any, search: string, item: any) => boolean,
  sort?: (a: any, b: any) => number
}, */
  {
    text: 'Name',
    align: 'start',
    value: 'somsinfo.displayName',
    display: true,
  },
  {
    text: 'User Principal Name',
    value: 'soms_upn',
    display: true,
  },
  {
    text: 'Institution Name',
    value: 'somsinfo.organizationName',
    display: true,
  },
  {
    text: 'Roles',
    value: 'appuserroles',
    align: 'start',
    display: true,
  },
  {
    text: 'Created At',
    value: 'createdAt',
    align: 'start',
    display: false,
  },
  {
    text: 'Disabled',
    value: 'user.disabled',
    align: 'start',
    display: false,
  },
  {
    text: 'Email',
    value: 'user.email',
    align: 'start',
    display: false,
  },
  {
    text: 'Last Login',
    value: 'updatedAt',
    align: 'end',
    display: true,
  },
];

const itemsPerPage = 10;
const OPTIONS = {
  groupBy: [],
  groupDesc: [],
  itemsPerPage,
  multiSort: true,
  mustSort: false,
  page: 1,
  sortBy: ['soms_upn', 'updatedAt'],
  sortDesc: [true, true],
};

const PAGINATION = {
  page: 1,
  itemsPerPage,
  pageStart: null,
  pageStop: null,
  pageCount: null,
  itemsLength: null,
};

export { HEADERS, OPTIONS, PAGINATION };
