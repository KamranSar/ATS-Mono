<template>
  <Panel icon="mdi-view-dashboard" title="User Management">
    <template slot="content">
      <v-container fluid>
        <v-data-table
          :headers="headers"
          :items="listOfUsers"
          :search="search"
          :disabled="loading"
          :loading="loading"
        >
          <!-- Top: Institution & User Search -->
          <template v-slot:top>
            <v-row no-gutters class="px-3">
              <v-spacer></v-spacer>
              <v-col :cols="$vuetify.breakpoint.mdAndDown ? 12 : 2"
                ><v-text-field
                  v-model="search"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  append-icon="mdi-magnify"
                  label="Search user"
                  single-line
                  hide-details
                ></v-text-field></v-col
            ></v-row>
          </template>

          <!-- Last DisplayName Column -->
          <template v-slot:item.displayName="{ item }">
            <UserAvatar :user="item" :showTooltip="true"></UserAvatar>
            {{
              item.somsinfo ? item.somsinfo.displayName : item.user.displayName
            }}
          </template>

          <template v-slot:item.soms_upn="{ item }">
            <span class="text-caption">{{ item.soms_upn || item.upn }}</span>
          </template>

          <!-- Last Login Column -->
          <template v-slot:item.updatedAt="{ item }">
            <v-chip v-if="item && item.updatedAt" color="primary">
              {{ formatDistanceToNow(item.updatedAt) }}
            </v-chip>
            <v-chip v-else> Never </v-chip>
          </template>

          <!-- Roles Column -->
          <template v-slot:item.appuserroles="{ item }">
            <!-- If Default Admin -->
            <v-autocomplete
              v-if="isDefaultAdmin() || isInstitutionUser(item)"
              v-model="item.roles"
              @change="setSelectedUser(item)"
              :disabled="loading"
              :items="appRoles"
              chips
              color="blue-grey lighten-2"
              label="Selected Roles"
              item-text="name"
              item-value="name"
              multiple
              clearable
              hide-details
            >
            </v-autocomplete>
            <span v-else>{{ item.roles.join(', ') }}</span>
          </template>
        </v-data-table>

        <!-- Reset and Save Roles Button -->
        <v-row no-gutters>
          <v-btn
            color="secondary"
            class="ma-2"
            @click="resetRoles()"
            :disabled="loading"
          >
            Reset
            <v-icon right dark> mdi-refresh </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!selectedUsers.length || loading"
            color="primary"
            class="ma-2 white--text"
            @click="saveRoles()"
          >
            Save Roles
            <v-icon right dark> mdi-cloud-upload </v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </template></Panel
  >
</template>

<script>
  /**
   * REQUIRED ROUTE: Users
   */
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import { formatDistanceToNow } from 'date-fns';
  import Panel from '@/components/layouts/Panel.vue';
  import { myApp, defaultAdminRole } from '@/config/myApp';
  import feathers from '@/feathers/index.js';
  import findAll from '@/feathers/helpers/findAll.js';
  import { get, sync } from 'vuex-pathify';

  /**
   * Set this to true if you want to get users by institution
   * Otherwise set to false to get users in the app.
   */
  export default {
    name: 'Users',
    components: {
      UserAvatar,
      Panel,
    },
    data: () => {
      return {
        search: '',
        headers: [
          {
            text: 'Name',
            align: 'start',
            value: 'displayName',
          },
          {
            text: 'User Principal Name',
            value: 'soms_upn',
          },
          {
            text: 'Institution Name',
            value: 'somsinfo.organizationName',
          },
          { text: 'Roles', value: 'appuserroles', align: 'start' },
          {
            text: 'Last Login',
            value: 'updatedAt',
            align: 'end',
          },
        ],
        listOfUsers: [],
        selectedUsers: [],
        selectedInstitution: '',
        appRoles: myApp.approles,
      };
    },
    computed: {
      ...get('users', ['loggedInUser']),
      ...sync('app', ['loading']),
    },
    async mounted() {
      this.listOfUsers = await this.getUser();
    },
    methods: {
      isDefaultAdmin() {
        if (
          this.loggedInUser &&
          this.loggedInUser.appuserroles &&
          this.loggedInUser.appuserroles.roles &&
          this.loggedInUser.appuserroles.roles.includes(defaultAdminRole.name)
        ) {
          return true;
        } else {
          return false;
        }
      },
      isInstitutionUser(institution) {
        if (
          institution &&
          institution.somsinfo &&
          institution.somsinfo.organizationName &&
          this.loggedInUser.somsinfo &&
          this.loggedInUser.somsinfo.organizationName &&
          this.loggedInUser.somsinfo.organizationName ===
            institution.somsinfo.organizationName
        ) {
          return true;
        } else {
          return false;
        }
      },
      /**
       * @param date - A valid date object or string
       * @returns A human readable date comparison.
       */
      formatDistanceToNow(date) {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      },
      /**
       * @param user - The selected user in listOfUsers
       */
      setSelectedUser(user) {
        const alreadySelected = this.selectedUsers.find((u) => {
          return u.userId === user.userId;
        });

        // Don't push what's already been selected.
        if (!alreadySelected) {
          this.selectedUsers.push(user);
        }
      },
      /**
       * getUser function
       * @returns All the users from the selected institution
       */
      async getUser() {
        this.listOfUsers = [];
        this.selectedUsers = [];

        try {
          this.loading = true;
          const users = await findAll('/api/auth/v1/accountsbyapp', {
            query: {
              appid: this.$myApp.azureAppID,
              soms_upn: {
                $search: this.search,
              },
              $sort: {
                soms_upn: 1,
              },
            },
          });

          this.listOfUsers = [...users.values()];
          return this.listOfUsers;
        } catch (error) {
          console.error('getUser: ', error);
          this.listOfUsers = [];
          this.selectedUsers = [];
          return [];
        } finally {
          this.loading = false;
        }
      },

      /**
       * resetRoles function
       * Makes an API call to fetch and reset back to
       * the roles that have been captured by this.selectedUsers
       */
      async resetRoles() {
        try {
          this.loading = true;

          for (let index = 0; index < this.selectedUsers.length; index++) {
            const user = this.selectedUsers[index];

            try {
              const response = await feathers
                .service('/api/auth/v1/appuserroles')
                .get(user._id);

              // Update approles directly so template can update too!
              user.roles = response && response.roles;
            } catch (error) {
              console.error(error);
              user.roles = [];
            }
          }

          this.selectedUsers = [];
        } catch (error) {
          console.log('resetRoles error: ', error);
        } finally {
          this.loading = false;
        }
      },
      /**
       * saveRoles function
       * Calls either a patch or create for the selected user to update their roles in appuserroles collection.
       */
      async saveRoles() {
        try {
          this.loading = true;

          const promiseArray = [];
          const appRoles = this.appRoles.map((role) => role.name);
          this.selectedUsers.forEach((user) => {
            if (user.roles) {
              for (let index = user.roles.length - 1; index >= 0; index--) {
                const role = user.roles[index];

                // If that role is no longer part of appRoles
                if (!appRoles.includes(role)) {
                  user.roles.splice(index, 1);
                }
              }

              // Update if roles already exist
              promiseArray.push(
                feathers.service('/api/auth/v1/appuserroles').patch(user._id, {
                  roles: user.roles,
                })
              );
            }
          });

          await Promise.all(promiseArray);

          await this.resetRoles(); // Just pull the ones that have been updated..
        } catch (error) {
          console.log('SaveRoles: ', error);
        } finally {
          this.loading = false;
        }
      },
    },
    watch: {
      /**
       * selectedInstitution watcher
       * Update the listOfUsers when selecting a new institution.
       */
      async selectedInstitution(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          await this.getUser();
        }
      },
    },
  };
</script>
