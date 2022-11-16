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
    text: 'Email',
    value: 'user.emailAddress',
    align: 'start',
    display: false,
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
    text: 'Staff Type',
    value: 'somsinfo.staffType',
    align: 'start',
    display: false,
  },
  {
    text: 'Work Assignment',
    value: 'somsinfo.workAssignment',
    align: 'start',
    display: false,
  },
  {
    text: 'Roles',
    value: 'roles',
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
    text: 'Last Login',
    value: 'appsession',
    align: 'end',
    display: true,
    sort: (a, b) => {
      const sessionObj = {
        updatedAt: new Date(2099, 1, 1).toISOString(),
      };
      if (!a) {
        a = sessionObj;
      }
      if (!b) {
        b = sessionObj;
      }

      return a.updatedAt.localeCompare(b.updatedAt);
    },
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
  sortBy: ['soms_upn', 'appsession'],
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

const SAVE_TYPE = {
  APPEND: {
    text: 'Add',
    value: 'ADD',
    tooltip: 'Will add to current roles',
  },
  OVERWRITE: {
    text: 'Overwrite',
    value: 'OVERWRITE WITH',
    tooltip: 'Will overwrite current roles',
  },
};

export { HEADERS, OPTIONS, PAGINATION, SAVE_TYPE };
