import { isAfter, isBefore, isMatch } from 'date-fns';
// import formatDate from '@/helpers/formatDate.js';

const FORMAT = {
  ISO_DATE: 'yyyy-MM-dd',
  LOCALE_DATE: 'MM/dd/yyyy',
};
export { FORMAT };
export default {
  /**
   * ! CAVEAT: v-date-picker accepts ISO 8601 date strings (YYYY-MM-DD).
   * https://vuetifyjs.com/en/components/date-pickers/#caveats
   *
   * Expects and saves date in YYYY-MM-DD
   * But displays in MM/DD/YYYY
   *
   */
  props: {
    label: {
      type: String,
      default: 'Date',
    },
    min: {
      type: String,
      default: '1900-01-01',
    },
    max: {
      type: String,
      default: '2099-12-31',
    },
  },
  data: () => ({
    valid: null,
  }),
  methods: {
    dateToClient(date) {
      // Convert ISO to locale
      if (date) {
        if (isMatch(date, FORMAT.ISO_DATE)) {
          const [year, month, day] = date.split('-');
          date = `${month}/${day}/${year}`;
        } else if (isMatch(date, FORMAT.LOCALE_DATE)) {
          const [month, day, year] = date.split('/');
          date = `${month}/${day}/${year}`;
        }
      } else {
        date = '';
      }
      return date;
    },
    dateToServer(date) {
      // arg is in MM/DD/YYYY format from controller
      if (date) {
        const [month, day, year] = date.split('/');
        if (month && day && year) {
          date = `${year}-${month}-${day}`;
        }
      }
      return date;
    },

    /**
     * Pre-defined Rules for dates
     */
    isLocaleDate(value) {
      const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
      const completeDate = pattern.test(value);
      const emptyDate = !value || value === '' || value.length !== 10;
      return emptyDate || completeDate || 'Invalid date.';
    },
    isAfterMin(value) {
      const [month, day, year] = value ? value.split('/') : [];
      if (value && month && day && year) {
        const [minYear, minMonth, minDay] = this.min.split('-');
        const dateValue = new Date(year, month - 1, day);
        const minDate = new Date(minYear, minMonth - 1, minDay);
        const validDate = isAfter(dateValue, minDate);
        return validDate || `Date must be after ${this.dateToClient(this.min)}`;
      } else {
        return true;
      }
    },
    isBeforeMax(value) {
      const [month, day, year] = value ? value.split('/') : [];
      if (value && month && day && year) {
        const [maxYear, maxMonth, maxDay] = this.max.split('-');
        const dateValue = new Date(year, month - 1, day);
        const maxDate = new Date(maxYear, maxMonth - 1, maxDay);
        const validDate = isBefore(dateValue, maxDate);
        return (
          validDate || `Date must be before ${this.dateToClient(this.max)}`
        );
      } else {
        return true;
      }
    },

    /**
     * Emitted events
     * @blur
     * @keyup
     * @input a.k.a. v-model
     */
    onBlur(e) {
      // console.log('onBlur', e);
      this.$emit('blur', e);
    },
    onKeyup(e) {
      // console.log('onKeyup', e);
      this.$emit('keyup', e);
    },
    onInput(e) {
      // console.log('onInput', e);
      this.$emit('input', e);
    },
  },
};
