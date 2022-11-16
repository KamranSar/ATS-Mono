<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="closeOnClick"
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
      @blur="onTextBlur"
      :min="min"
      :max="max"
      :active-picker.sync="activePicker"
      v-bind="$attrs"
    ></v-date-picker>
    <template v-slot:activator="{ on, attrs }">
      <v-form v-model="valid" @submit.prevent lazy-validation>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              :label="label"
              @keyup.enter="onKeyup"
              @blur="onTextBlur"
              v-bind="attrs"
              v-model="textFieldModel"
              :disabled="disabled"
              :hint="String(FORMAT.LOCALE_DATE).toUpperCase()"
              :solo="solo"
              :placeholder="placeholder"
              @click:clear="onInput('')"
              v-mask="'##/##/####'"
              :rules="[
                isLocaleDate(textFieldModel),
                isAfterMin(textFieldModel),
                isBeforeMax(textFieldModel),
              ]"
            >
              <template v-slot:prepend>
                <v-btn
                  class="pb-2"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  :disabled="disabled"
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

  import DatePicker, { FORMAT } from '@/mixins/DatePicker.js';

  export default {
    name: 'DatePicker',
    props: {
      /**
       * The label shown on the text field
       */
      label: {
        type: String,
        default: 'Date',
      },
      /**
       * The v-model binded to <DatePicker v-model="..."/>
       */
      value: {
        // Type is not defined here as v-mask handles the input and clearable sets value to null
        required: true,
      },
      disabled: { type: Boolean, required: false },
      closeOnClick: { type: Boolean, default: false, required: false },
      solo: { type: Boolean, default: false, required: false },
      placeholder: { type: String, default: null, required: false },
      pickerType: { type: String, default: 'DAY', required: false },
    },
    mixins: [DatePicker], // Brings in min, max, valid, and rules
    data: () => ({
      FORMAT,
      datePickerModel: null,
      menu: false,
      activePicker: null,
      isSolo: false,
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
      onChange(value) {
        this.onInput(value);
        this.$refs.menu.save(value);
        this.$emit('change', value);
      },
      onTextBlur(e) {
        const dateValue = this.dateToServer(e.target.value);
        this.$emit('textBlur', dateValue);
      },
    },
    watch: {
      menu(val) {
        val && setTimeout(() => (this.activePicker = this.pickerType));
      },
    },
  };
</script>
