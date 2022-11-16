<template>
  <v-container>
    <v-row class="mt-12">
      <v-col cols="12" md="3">
        <v-card flat height="100%" color="transparent">
          <v-col align="end">
            <v-img
              contain
              height="200px"
              width="200px"
              :src="`${$myApp.publicPath}${imgLocation}`"
              justify="end"
            ></v-img>
          </v-col>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card flat height="100%" color="transparent">
          <p class="display-1 font-weight-bold mt-5">
            You are not authorized to access this application.
          </p>
          <p class="title">
            Please contact the system administrator for assistance.
          </p>
          <v-btn
            v-if="!isUserLoggedIn"
            color="primary"
            large
            :to="{ name: 'Login' }"
            >Login</v-btn
          >
          <v-btn
            v-else
            class="mx-2"
            color="primary"
            large
            :to="{ name: 'Home' }"
            >Take me home</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify';
  export default {
    data: () => ({
      imgLocation: '/img/logo.svg',
    }),
    computed: {
      ...get('users', ['isUserLoggedIn']),
    },
  };
</script>
