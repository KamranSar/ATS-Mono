<template>
  <v-menu
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    :disabled="disabled"
    max-width="290px"
    min-width="auto"
  >
    <v-date-picker
      v-model="datePickerModel"
      :disabled="disabled"
      @change="onChange"
      @blur="onBlur"
      :min="min"
      :max="max"
      active-picker="YEAR"
      no-title
      v-bind="$attrs"
    ></v-date-picker>
    <template v-slot:activator="{ on, attrs }">
      <v-form v-model="valid" @submit.prevent lazy-validation>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              :label="label"
              @keyup.enter="onKeyup"
              @blur="onBlur"
              v-bind="attrs"
              v-model="textFieldModel"
              :disabled="disabled"
              hint="MM/DD/YYYY"
              clearable
              @click:clear="onInput('')"
              v-mask="'##/##/####'"
              :rules="[
                isLocaleDate(textFieldModel),
                isAfterMin(textFieldModel),
                isBeforeMax(textFieldModel),
              ]"
            >
              <template v-slot:prepend>
                <v-btn icon v-bind="attrs" v-on="on" :disabled="disabled"
                  ><v-icon>mdi-calendar</v-icon></v-btn
                >
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-menu>
</template>
<script>
  /**
   * ! CAVEAT: v-date-picker accepts ISO 8601 date strings (YYYY-MM-DD).
   * https://vuetifyjs.com/en/components/date-pickers/#caveats
   *
   * Expects and saves date in YYYY-MM-DD
   * But displays in MM/DD/YYYY
   */

  import { isAfter, isBefore } from 'date-fns';
  export default {
    name: 'DatePicker',

    /**
     * ! CAVEAT: v-date-picker accepts ISO 8601 date strings (YYYY-MM-DD).
     * https://vuetifyjs.com/en/components/date-pickers/#caveats
     *
     * Expects and saves date in YYYY-MM-DD
     * But displays in MM/DD/YYYY
     *
     */
    props: {
      value: {
        // Type is not defined here as v-mask handles the input and clearable sets value to null
        required: true,
      },
      disabled: {
        type: Boolean,
        required: false,
      },
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
      datePickerModel: null,
    }),
    computed: {
      textFieldModel: {
        get() {
          return this.dateToClient(this.value);
        },
        set(value) {
          const dateValue = this.dateToServer(value);
          this.onInput(dateValue);
          this.datePickerModel = dateValue;
        },
      },
    },
    methods: {
      /**
       * Takes the formatted date string from the server in YYYY-MM-DD format
       * and returns it to MM/DD/YYYY
       * @param {String} date Date in the format of YYYY-MM-DD
       * @returns {String} MM/DD/YYYY
       */
      dateToClient(date) {
        // arg is in yyyy-MM-DD format from server so it can sort properly
        if (date) {
          const [year, month, day] = date.split('-');
          if (year && month && day) {
            date = `${month}/${day}/${year}`;
          }
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
        const pattern =
          /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
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
          return (
            validDate || `Date must be after ${this.dateToClient(this.min)}`
          );
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

      onChange(value) {
        this.onInput(value);
        this.$emit('change', value);
      },
    },
  };
</script>
