<template>
  <v-autocomplete
    v-model="selected"
    :disabled="loading"
    :items="listOfInstitutions"
    color="blue-grey lighten-2"
    label="Institution"
    item-text="institutionName"
    item-value="institutionName"
    return-object
    prepend-icon="mdi-bank"
    clearable
    hide-details="auto"
    class="ma-1 pa-1"
    autofocus
    background-color="white"
    @change="onChange"
  >
  </v-autocomplete>
</template>

<script>
  import { get } from 'vuex-pathify';
  export default {
    name: 'InstitutionDropdown',
    props: {
      value: {
        required: true,
      },
      loading: {
        type: Boolean,
      },
    },
    computed: {
      ...get('institutions', ['listOfInstitutions']),
      selected: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    methods: {
      onChange(e) {
        this.$emit('change', e);
      },
    },
  };
</script>
