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
              <v-card-title class="title"> Sign Out Disclaimer </v-card-title>
              <v-card-text
                >Doing so will also sign you out of all other microsoft
                connection applications (Teams, Outlook, Microsoft 365,
                DocuSign...).</v-card-text
              >
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
  import { signout } from '@/router/helpers/index.js';

  export default {
    name: 'SignOut',
    data: () => {
      return {
        dialog: true,
      };
    },
    components: {
      Panel: () => import('@/components/layouts/Panel'),
    },
    methods: {
      dismiss() {
        this.dialog = false;
      },
      signout,
    },
  };
</script>
