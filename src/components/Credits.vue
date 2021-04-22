<template>
  <v-dialog v-model="creditsDialog">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <a>Credits</a>
      </span>
    </template>

    <v-card flat>
      <v-card-title class="subheading grey lighten-3" primary-title
        >Credits</v-card-title
      >

      <v-card-text>
        <p class="credit-text mt-3">
          This application could not have happened without the awesome
          contributions from our team and from the wider community.
        </p>

        <ul>
          <li>
            EIS Mobile Dev Team
            <ul>
              Nurthin Aziz, Kevin Baroni, Nathan Brizzee, Dave Eggers, Jeff
              Funk, Jon Wegsteen, and many more!
            </ul>
          </li>
          <li>
            Framework, Material Design and Icons
            <ul>
              <li>
                Framework by the team @
                <a href="https://www.vuejs.org" target="_blank" rel="nofollow"
                  >VueJS</a
                >
              </li>
              <li>
                Material Design with
                <a
                  href="https://www.vuetifyjs.com"
                  target="_blank"
                  rel="nofollow"
                  >Vuetify</a
                >
              </li>
              <li>
                Free awesome icons @
                <a
                  href="https://www.fontawesome.com/"
                  target="_blank"
                  rel="nofollow"
                  >fontawesome</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="creditsDialog = false">
          Thank you
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {};
    },
    data() {
      return {
        creditsDialog: false,
      };
    },
  };
</script>
