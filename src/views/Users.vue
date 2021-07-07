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
              <v-col :cols="$vuetify.breakpoint.mdAndDown ? 12 : 4"
                ><v-autocomplete
                  v-model="selectedInstitution"
                  :disabled="loading"
                  :items="listOfInstitutions"
                  color="blue-grey lighten-2"
                  label="Select an institution"
                  item-text="institutionName"
                  item-value="institutionPartyId"
                  prepend-icon="mdi-bank"
                  clearable
                  single-line
                  hide-details
                >
                </v-autocomplete
              ></v-col>
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

          <template v-slot:item.displayName="{ item }">
            <UserAvatar :user="item"></UserAvatar>
            {{ item.displayName }}
          </template>

          <!-- Last Login Column -->
          <template v-slot:item.appsession.updatedAt="{ item }">
            <v-chip
              v-if="item && item.appsession && item.appsession.updatedAt"
              color="primary"
            >
              {{ formatDistanceToNow(item.appsession.updatedAt) }}
            </v-chip>
            <v-chip v-else> Never </v-chip>
          </template>

          <!-- Roles Column -->
          <template v-slot:item.approles="{ item }">
            <v-autocomplete
              v-if="item.approles && item.approles.roles"
              v-model="item.approles.roles"
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
          // {
          //   text: 'User Principal Name',
          //   value: 'userPrincipalName',
          // },
          { text: 'Roles', value: 'approles', align: 'start' },
          {
            text: 'Last Login',
            value: 'appsession.updatedAt',
            align: 'end',
          },
        ],
        listOfUsers: [],
        listOfInstitutions: [],
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
      this.listOfInstitutions = await this.getInstitutions();
    },
    methods: {
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
        const alreadySelected = this.selectedUsers.find(
          (u) => u.staffId === user.staffId
        );

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
          const users = await findAll('/api/auth/v1/somsaccounts', {
            query: {
              organizationId: this.selectedInstitution,
              $sort: {
                lastName: 1,
                firstName: 1,
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
       * getInstitutions function
       * @returns - All the institutions if you are the default admin role, otherwise it grabs your logged in institution
       */
      async getInstitutions() {
        try {
          this.loading = true;
          const queryObject = {
            query: {
              $sort: {
                institutionName: 1,
              },
            },
          };

          if (
            this.loggedInUser &&
            this.loggedInUser.approles &&
            this.loggedInUser.approles.roles.length &&
            !this.loggedInUser.approles.roles.includes(defaultAdminRole.name)
          ) {
            queryObject.query['institutionPartyId'] =
              this.loggedInUser.somsinfo.organizationId;
          }

          const institutions = await findAll(
            '/api/eis/common/v1/institution',
            queryObject
          );

          this.listOfInstitutions = [...institutions.values()];
          return this.listOfInstitutions;
        } catch (error) {
          console.error('getInstitutions: ', error);
          this.listOfInstitutions = [];
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
            const organizationId = this.selectedInstitution;
            const user = this.selectedUsers[index];
            const { userPrincipalName } = user;

            const response = await feathers
              .service('/api/auth/v1/somsaccounts')
              .find({
                query: {
                  organizationId,
                  userPrincipalName,
                  $sort: {
                    lastName: 1,
                    firstName: 1,
                  },
                },
              });

            // Update approles directly so template can update too!
            user.approles =
              response.data && response.data[0] && response.data[0].approles
                ? response.data[0].approles
                : [];
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
          this.selectedUsers.forEach((user) => {
            if (user.approles) {
              // Update if roles already exist
              promiseArray.push(
                feathers
                  .service('/api/auth/v1/appuserroles')
                  .patch(user.approles._id, {
                    roles: user.approles.roles,
                  })
              );
            } else {
              // Create the 'create' call
              promiseArray.push(
                feathers.service('/api/auth/v1/appuserroles').create({
                  userId: user._id,
                  appid: this.$myApp.cdcrAppID,
                  roles: user.approles.roles,
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
