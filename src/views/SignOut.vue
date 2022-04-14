<template>
  <Panel title="Sign Out">
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Sign Out
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="title"> {{ title }} </v-card-title>
              <v-card-text>{{ text }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dismiss"> Cancel </v-btn>
                <v-btn color="error darken-1" text @click="signout">
                  Sign Out
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </template>
  </Panel>
</template>

<script>
  /**
   * REQUIRED ROUTE: Signout
   */
  import signout from '@cdcr/vue-frontend/helpers/signout';
  import { ref } from '@vue/composition-api';

  export default {
    name: 'SignOut',
    components: {
      Panel: () => import('@cdcr/vue-frontend/components/layouts/Panel'),
    },
    setup() {
      const dialog = ref(true);
      const title = 'Are you sure?';
      const text =
        "You'll have to re-type your email, password and re-authenticate the next time you log in.";

      const dismiss = () => {
        dialog.value = false;
      };
      return { dialog, title, text, dismiss, signout };
    },
  };
</script>
