<template>
  <v-snackbar v-model="show" top center :color="color" :timeout="timeout">
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn color="white" icon small v-bind="attrs" @click="show = false">
        <v-icon>fa-times</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        top: true,
        message: '',
        color: '',
        timeout: 6000,
      };
    },
    created: function () {
      this.$store.watch(
        (state) => state.snackbar.snack,
        () => {
          const message = this.$store.state.snackbar.snack.message;
          if (message) {
            this.show = true;
            this.message = message;
            this.timeout = this.$store.state.snackbar.snack.timeout || 6000;
            this.color = this.$store.state.snackbar.snack.color || 'info';
            this.$store.commit('snackbar/setSnack', {});
          }
        }
      );
    },
  };
</script>
