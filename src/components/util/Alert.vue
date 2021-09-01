<template>
  <transition name="fade">
    <v-container
      fluid
      :style="alertContainerStyle"
      v-if="alert && alert.message"
    >
      <v-row justify="center">
        <v-alert
          border="left"
          :type="alert.type"
          dismissible
          elevation="3"
          @input="alert.message = ''"
          dense
          :prominent="showButton"
        >
          <span v-html="alert.message" />
          <v-btn
            v-if="showButton"
            outlined
            @click="alert.onClick"
            v-html="alert.button"
            class="ml-3"
            dense
          ></v-btn>
        </v-alert>
      </v-row> </v-container
  ></transition>
</template>
<script>
  import { sync } from 'vuex-pathify';
  export default {
    computed: {
      ...sync('app', ['alert']),
      /**
       * This styling allows the alert container to float on top of the canvas without obstruction.
       */
      alertContainerStyle() {
        return {
          position: 'absolute',
          'z-index': 1,
          top: this.$vuetify.application.top + 15 + 'px',
        };
      },
      /**
       * Prominent takes up vertical real-estate, only use when displaying a button
       */
      showButton() {
        return Boolean(this.alert.onClick && this.alert.button);
      },
    },
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
