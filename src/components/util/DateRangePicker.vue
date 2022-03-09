<template>
  <v-menu
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    :disabled="disabled"
    :max-width="width"
    min-width="auto"
  >
    <v-date-picker
      v-model="datePickerModel"
      :disabled="disabled"
      range
      @change="onChange"
      @blur="onBlur"
      :min="min"
      :max="max"
      active-picker="YEAR"
      no-title
      full-width
    ></v-date-picker>
    <template v-slot:activator="{ on, attrs }">
      <v-form v-model="valid" @submit.prevent lazy-validation>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              :dense="dense"
              :label="label"
              @keyup.enter="onKeyup"
              @blur="onBlur"
              v-bind="attrs"
              v-model="fromField"
              :disabled="disabled"
              :hint="fromHint"
              v-mask="'##/##/####'"
              placeholder="From"
              :rules="[
                isLocaleDate(fromField),
                isAfterMin(fromField),
                isBeforeMax(fromField),
              ]"
            >
              <template v-slot:prepend>
                <v-btn icon v-bind="attrs" v-on="on" :disabled="disabled"
                  ><v-icon>mdi-calendar</v-icon></v-btn
                >
              </template>
            </v-text-field>
          </v-col>
          <!-- <div class="divider" /> -->
          <v-divider vertical style="transform: rotate(5deg)" class="mx-2" />
          <v-col>
            <v-text-field
              :dense="dense"
              @keyup.enter="onKeyup"
              @blur="onBlur"
              v-bind="attrs"
              v-model="toField"
              :disabled="disabled"
              :hint="toHint"
              clearable
              @click:clear="onInput([])"
              v-mask="'##/##/####'"
              placeholder="To"
              :rules="[
                isLocaleDate(toField),
                isAfterMin(toField),
                isBeforeMax(toField),
              ]"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-menu>
</template>
<script>
  import { isAfter } from 'date-fns';
  import DatePicker, { FORMAT } from '@/mixins/DatePicker.js';

  export default {
    name: 'DateRangePicker',
    props: {
      /** Width of the date picker */
      width: {
        type: String,
        default: '350px',
      },
      /**
       * Hint to display under the from field
       */
      fromHint: {
        type: String,
        default: 'MM/DD/YYYY',
      },
      toHint: {
        type: String,
        default: 'MM/DD/YYYY',
      },
      dense: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Array,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: false,
      },
    },
    mixins: [DatePicker],
    data: () => ({
      FORMAT,
      // Check that it's a vaid date before setting datePickerModel
      datePickerModel: [],
    }),
    computed: {
      fromField: {
        get() {
          return this.dateToClient(this.value[0]);
        },
        set(value) {
          const dateValue = [
            this.dateToServer(value),
            this.dateToServer(this.toField),
          ];

          this.onInput(dateValue);
          this.datePickerModel = dateValue;
        },
      },
      toField: {
        get() {
          return this.dateToClient(this.value[1]);
        },
        set(value) {
          const dateValue = [
            this.dateToServer(this.fromField),
            this.dateToServer(value),
          ];
          this.onInput(dateValue);
          this.datePickerModel = dateValue;
        },
      },
    },
    mounted() {
      if (!this.value[0]) {
        this.fromField = '';
      }

      if (!this.value[1]) {
        this.toField = '';
      }
    },
    methods: {
      onChange(value) {
        // Create a new date to compare with isAfter
        if (Array.isArray(value) && value.length === 2) {
          // Build the fromDate
          const [frYear, frMonth, frDay] = value[0].split('-');
          const fromDate = new Date(frYear, frMonth - 1, frDay);

          // Build the toDate
          const [toYear, toMonth, toDay] = value[1].split('-');
          const toDate = new Date(toYear, toMonth - 1, toDay);
          console.log('fromDate: ', fromDate);
          console.log('toDate: ', toDate);

          // If the from date is after the to date... swap them
          if (isAfter(fromDate, toDate)) {
            value[0] = `${toYear}-${toMonth}-${toDay}`;
            value[1] = `${frYear}-${frMonth}-${frDay}`;
          }
          this.onInput(value);
          this.$emit('change', value);
        }
      },
    },
  };
</script>
