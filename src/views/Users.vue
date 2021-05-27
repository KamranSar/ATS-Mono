<template>
  <Panel icon="mdi-view-dashboard" title="User Management">
    <template slot="content">
      <v-container fluid>
        <v-row>
          <!-- First column to display users -->
          <v-col sm="12" md="4" lg="4">
            <v-autocomplete
              v-model="selectedUsers"
              :disabled="loading"
              :items="listOfUsers"
              filled
              chips
              color="blue-grey lighten-2"
              label="Selected users"
              item-text="displayname"
              item-value="_id"
              multiple
              clearable
            >
            </v-autocomplete>

            <!-- TODO: Fill the entire height -->
            <!-- Scroll list of selected users. Not shown on small devices -->
            <v-virtual-scroll
              v-if="$vuetify.breakpoint.mdAndUp"
              :items="selectedUsers"
              height="300"
              item-height="64"
            >
              <template v-slot:default="{ item }">
                <v-list-item @click="toggleUser(item)" two-line>
                  <v-list-item-avatar>
                    <UserAvatar :user="mappedUsers.get(item)"></UserAvatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ mappedUsers.get(item).username }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Last Login:
                      {{ formatDistance(mappedUsers.get(item).updatedAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon> <v-icon>mdi-close</v-icon></v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-col>

          <!-- Second column to display roles -->
          <v-col sm="12" md="8" lg="8">
            <v-autocomplete
              v-model="selectedRoles"
              v-bind:disabled="loading"
              v-bind:items="appRoles"
              filled
              chips
              color="blue-grey lighten-2"
              label="Selected Roles"
              item-text="name"
              item-value="name"
              multiple
              clearable
            >
            </v-autocomplete>
            <!-- TODO: Make this scrollable -->
            <v-list two-line>
              <v-list-item
                v-for="role in appRoles"
                :key="role.name"
                @click="toggleRole(role.name)"
              >
                <v-list-item-action>
                  <v-checkbox
                    color="primary accent-4"
                    :value="selectedRoles.includes(role.name)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ role.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ role.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-row no-gutters>
              <v-btn
                color="secondary"
                class="ma-2"
                @click="updateRoles(true)"
                :disabled="loading"
              >
                Reset
                <v-icon right dark> mdi-refresh </v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!selectedUsers[0]"
                :loading="loading"
                color="primary"
                class="ma-2 white--text"
                @click="saveRoles()"
              >
                Save Roles
                <v-icon right dark> mdi-cloud-upload </v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template></Panel
  >
</template>

<script>
  /**
   * REQUIRED ROUTE: Users
   */
  import Panel from '@/components/layouts/Panel.vue';
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import myApp from '@/config/myApp';
  import Users from '@/feathers/services/users/users.service.js';
  import feathers from '@/config/private/feathers.js';
  import { sync } from 'vuex-pathify';
  import { formatDistance, parseISO } from 'date-fns';

  export default {
    name: 'Users',
    components: {
      Panel,
      UserAvatar,
    },
    data: () => {
      return {
        listOfUsers: [],
        selectedUsers: [],
        selectedRoles: [],
        appRoles: myApp.approles,
      };
    },
    computed: {
      ...sync('app', ['loading']),
      // User list mapped by id
      mappedUsers() {
        const mappedUsers = new Map();
        this.listOfUsers.forEach((user) => {
          mappedUsers.set(user._id, user);
        });

        return mappedUsers;
      },
      items() {
        return Array.from({ length: 700 }, (k, v) => v + 1);
      },
    },
    async mounted() {
      this.listOfUsers = await this.getUser();
    },
    methods: {
      async getUser() {
        this.loading = true;
        const users = await Users.find({
          query: {
            disabled: false,
          },
        });
        this.loading = false;
        return users.data;
      },
      formatDistance(date) {
        if (!date) return '';
        return formatDistance(parseISO(date), new Date());
      },
      toggleUser(id) {
        const index = this.selectedUsers.indexOf(id);
        if (index >= 0) {
          this.selectedUsers.splice(index, 1);
        } else {
          this.selectedUsers.push(id);
        }
      },
      toggleRole(name) {
        const index = this.selectedRoles.indexOf(name);
        if (index >= 0) {
          this.selectedRoles.splice(index, 1);
        } else {
          this.selectedRoles.push(name);
        }
      },
      /**
       * NOTE: When unselected a user, those permissions that may have come with it stay.
       * @param {Boolean} reset - When a true Boolean is passed in, selectedRoles gets reset.
       */
      updateRoles(reset = false) {
        if (typeof reset === 'boolean' && reset) this.selectedRoles = [];

        this.selectedUsers.forEach((userId) => {
          const user = this.mappedUsers.get(userId);
          if (user.approles && user.approles.length) {
            user.approles.forEach((role) => {
              if (!this.selectedRoles.includes(role)) {
                this.selectedRoles.push(role);
              }
            });
          }
        });
      },
      // TODO: Add warnings when adding/removing all roles from a user
      async saveRoles() {
        this.loading = true;
        console.log('Saving these roles: ', this.selectedRoles);
        console.log('To these users: ', this.selectedUsers);

        const promisesArray = [];
        this.selectedUsers.forEach((userId) => {
          const user = this.mappedUsers.get(userId);
          if (user.approles) {
            // Update if roles already exist
            promisesArray.push(
              feathers
                .service('/api/auth/v1/appuserroles')
                .patch(user.approleid, {
                  roles: this.selectedRoles,
                })
            );
          } else {
            // Create the 'create' call
            promisesArray.push(
              feathers.service('/api/auth/v1/appuserroles').create({
                userId,
                appid: this.$myApp.cdcrAppID,
                roles: this.selectedRoles,
              })
            );
          }
        });

        const results = await Promise.all(promisesArray);
        console.log('results:', results);

        this.listOfUsers = await this.getUser();
        this.loading = false;
      },
    },
    watch: {
      selectedUsers: {
        immediate: true,
        handler: 'updateRoles',
      },
    },
  };
</script>
