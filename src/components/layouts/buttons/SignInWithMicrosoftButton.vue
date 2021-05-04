<template>
  <v-btn
    :color="$vuetify.theme.dark ? '#2F2F2F' : '#FFFFFF'"
    ripple
    :tile="true"
    height="48px"
    elevation="3"
    :loading="loading"
    @click="$emit('click')"
  >
    <v-img
      max-height="25px"
      max-width="25px"
      class="ml-n1 mr-3 pa-1"
      src="/img/ms-symbollockup_mssymbol_19.svg"
    ></v-img>
    <span
      class="buttonText"
      :style="{ color: $vuetify.theme.dark ? '#ffffff' : '#5E5E5E' }"
    >
      <div v-if="small">Sign in</div>
      <div v-else>Sign in with Microsoft</div>
    </span>
  </v-btn>
</template>

<script>
  export default {
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-branding-in-azure-ad-apps
    name: 'SignInWithMicrosoftButton',
    props: {
      small: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  span.buttonText {
    font-size: 16px;
    font-weight: 600;
    /* Use the font that is loaded in the <head> */
    font-family: 'Segoe UI', 'Roboto', sans-serif;
  }
  .v-btn {
    text-transform: none !important;
  }
</style>
