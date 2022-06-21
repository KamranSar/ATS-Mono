/**
 * @class DataTableHeader as defined by Vuetify (https://vuetifyjs.com/en/api/v-data-table/#props)
 * @classdesc Import this file to extend beyond the defaults...
 */
class DataTableHeader {
  constructor({
    text = '',
    value = '', // The property name
    align = '', // 'start' | 'center' | 'end'
    sortable = true,
    filterable = true,
    groupable = true,
    divider = false,
    classList = '', // string | string[]
    cellClass = '', // string | string[]
    width = '', // string | number
    filter = null, // (value: any, search: string, item: any) => boolean
    sort = null, // (a: any, b: any) => number
    formatter = null, // (item: any, value: string) => any
    router = null, // (item: value, value: string) => RouteConfig
  }) {
    this.text = text;
    this.value = value;
    this.align = align;
    this.sortable = sortable;
    this.filterable = filterable;
    this.groupable = groupable;
    this.divider = divider;
    this.class = classList;
    this.cellClass = cellClass;
    this.width = width;
    this.filter = filter;
    this.sort = sort;
    this.formatter = formatter;
    this.router = router;
  }

  /**
   *
   * @param {*} item
   * @returns The formatted item value as returned by `formatter` or the unformatted item value.
   */
  format(item) {
    if (this.formatter) {
      return this.formatter(item, this.value);
    } else {
      return item[this.value];
    }
  }

  /**
   * Defines the route config that gets passed into a <router-link :to="..." /> tag
   * @param {*} item
   * @returns {name: String, params: Object, title: String} - If null then the DataTableHeader is treated normally
   */
  // eslint-disable-next-line no-unused-vars
  route(item) {
    if (this.router) {
      return this.router(item, this.value);
    } else {
      return null;
    }
  }
}

export default DataTableHeader;
