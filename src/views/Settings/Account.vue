<template>
  <v-card flat>
    <v-card-text>
      <v-row no-gutters justify="start" align="center">
        <v-avatar rounded size="120">
          <v-img :src="myPhoto"></v-img>
        </v-avatar>

        <v-btn
          color="primary"
          href="https://myworkaccount.microsoft.com/"
          target="_blank"
          class="ml-2"
        >
          Edit {{ $vuetify.breakpoint.smAndDown ? '' : 'Profile' }}
        </v-btn>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-form class="multi-col-validation mt-6">
        <v-row>
          <v-col
            md="6"
            cols="12"
            v-for="item in accountItems"
            :key="item.label"
          >
            <v-text-field
              readonly
              :label="item.label"
              dense
              outlined
              :value="item.value"
            ></v-text-field>
          </v-col>

          <!-- Account disabled alert -->
          <v-col cols="12" v-if="this.loggedInUser.disabled">
            <v-alert color="warning" text class="mb-0">
              <div class="d-flex align-start">
                <v-icon color="warning"> mdi-alert-outline </v-icon>

                <div class="ms-3">
                  <p class="text-base font-weight-medium mb-1">
                    Your account has been disabled. Contact your Administrator
                    to regain access or try again later.
                  </p>
                </div>
              </div>
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify';
  import { MULTIPLE_USER_ROLES_ENABLED } from '@/config/appFeatures.js';
  import { format } from 'date-fns';
  export default {
    name: 'Account',
    data: () => ({}),
    computed: {
      ...get('users', ['loggedInUser']),
      ...get('azureAuthentication', ['myPhoto']),
      accountItems() {
        const newDate = new Date(this.loggedInUser.updatedAt);
        const items = [
          {
            label: 'Username',
            value: this.loggedInUser.username,
          },
          {
            label: 'Name',
            value:
              this.loggedInUser.lastName + ', ' + this.loggedInUser.firstName,
          },
          {
            label: 'E-mail',
            value: this.loggedInUser.emailAddress,
          },
          {
            label: `Role${MULTIPLE_USER_ROLES_ENABLED ? '(s)' : ''}`,
            value: this.loggedInUser.appuserroles.roles.join(', '),
          },
          {
            label: 'Status',
            value: this.loggedInUser.disabled ? 'Disabled' : 'Active',
          },
          {
            label: 'Last Updated',
            value: format(newDate, 'MM/dd/yyyy'),
          },
        ];

        return items;
      },
    },
  };
</script>
