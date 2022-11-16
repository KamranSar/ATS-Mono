<template>
  <v-img
    class="white--text pa-0 ma-0"
    :src="displayPhoto"
    contain
    max-height="250px"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <template v-slot:placeholder>
      <v-progress-circular
        indeterminate
        color="grey lighten-5"
      ></v-progress-circular>
    </template>
  </v-img>
</template>

<script>
  import { userplaceholder } from '@/assets/userplaceholder.js';

  export default {
    name: 'OffenderImage',
    props: {
      somsOffender: {
        type: Object,
        required: true,
      },
    },
    computed: {
      displayPhoto() {
        if (this.somsOffender && this.somsOffender.photograph) {
          return `data:image/jpg;base64,${this.somsOffender.photograph}`;
        } else {
          return `data:image/jpg;base64,${userplaceholder}`;
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
