<template>
  <v-autocomplete
    v-model="selectedInstitution"
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
    @change="$emit('change')"
  >
  </v-autocomplete>
</template>

<script>
  import { get, sync } from 'vuex-pathify';
  export default {
    name: 'InstitutionDropdown',
    computed: {
      // listOfInstitution is fetched on institutions modules init
      ...get('institutions', ['listOfInstitutions']),
      ...sync('institutions', ['selectedInstitution']),
      ...get('app', ['loading']),
    },
  };
</script>
