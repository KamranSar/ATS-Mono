<template>
  <Panel icon="mdi-view-dashboard" title="User Management">
    <template slot="content">
      <v-container fluid>
        <v-data-table
          :items="listOfUsers"
          :search="search"
          :disabled="loading"
          :loading="loading"
          :headers="visibleHeaders"
          :options.sync="options"
          :server-items-length.sync="pagination.itemsLength"
          :page.sync="pagination.page"
          :disable-pagination="loading"
          multi-sort
        >
          <template v-slot:top>
            <v-row no-gutters class="pa-2">
              <!-- User Search Field -->
              <v-col :cols="$vuetify.breakpoint.mdAndDown ? 6 : 2"
                ><v-text-field
                  v-model="search"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  append-icon="mdi-magnify"
                  label="Search user"
                  single-line
                  hide-details
                  clearable
                  @click:append="getUsers"
                  @keyup.enter="getUsers"
                >
                </v-text-field>
              </v-col>

              <v-spacer></v-spacer>

              <!-- Reset Sort Button -->
              <v-btn
                class="mt-3"
                color="primary lighten-1"
                text
                @click="resetSort()"
                ><v-icon class="pr-1">mdi-sort-variant-remove</v-icon>Reset
                Sort</v-btn
              >

              <!-- Filter Columns Button -->
              <v-menu
                offset-y
                :close-on-content-click="false"
                max-height="350px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mt-3"
                    v-bind="attrs"
                    v-on="on"
                    color="primary lighten-1"
                    text
                    ><v-icon class="pr-1">mdi-filter</v-icon>Columns</v-btn
                  >
                </template>
                <v-list class="column-header">
                  <v-list-item @click="resetColumns()">
                    <v-list-item-icon>
                      <v-icon>mdi-filter-remove</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Reset Columns</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>

                  <v-list-item
                    v-for="(header, index) in headers"
                    :key="header.value"
                  >
                    <v-list-item-action>
                      <v-checkbox v-model="header.display"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ header.text }}</v-list-item-title>
                    </v-list-item-content>
                    <v-btn
                      v-if="index"
                      icon
                      small
                      @click="moveHeader(header, index, index - 1)"
                      ><v-icon> mdi-arrow-up</v-icon></v-btn
                    >
                    <v-btn
                      v-if="index !== headers.length - 1"
                      icon
                      small
                      @click="moveHeader(header, index, index + 1)"
                      ><v-icon>mdi-arrow-down</v-icon></v-btn
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </template>
          <!-- Header: displayName -->
          <template v-slot:item.somsinfo.displayName="{ item }">
            <div>
              <UserAvatar :user="item" :showTooltip="true"></UserAvatar>
              {{
                item.somsinfo
                  ? item.somsinfo.displayName
                  : item.user.displayName
              }}
            </div>
          </template>

          <!-- Header: soms_upn -->
          <template v-slot:item.soms_upn="{ item }">
            <div>
              <span class="text-caption">{{ item.soms_upn || item.upn }}</span>
            </div>
          </template>

          <template v-slot:item.createdAt="{ item }">
            <div>
              <v-chip v-if="item && item.createdAt" color="primary">
                {{ formatDistanceToNow(item.createdAt) }}
              </v-chip>
              <v-chip v-else> Never </v-chip>
            </div>
          </template>

          <!-- Header: updatedAt -->
          <template v-slot:item.updatedAt="{ item }">
            <div>
              <v-chip v-if="item && item.updatedAt" color="primary">
                {{ formatDistanceToNow(item.updatedAt) }}
              </v-chip>
              <v-chip v-else> Never </v-chip>
            </div>
          </template>

          <!-- Header: appuserroles -->
          <template v-slot:item.appuserroles="{ item }">
            <div>
              <!-- If Default Admin || Institution User -->
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
            </div>
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
            Reset Roles
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
  import {
    HEADERS,
    OPTIONS,
    PAGINATION,
  } from '@/components/Users/constants.js';

  /**
   * Set this to true if you want to get users by institution
   * Otherwise set to false to get users in the app.
   */
  import cloneDeep from 'lodash.clonedeep';
  import AccountsByApp from '@/feathers/services/accountsbyapp/accountsbyapp.service';

  /**
   * Builds the $sort param into the query object passed in
   *
   * @param {Object} query - Query object to continue building from
   * @param {Object} options - The options object returned from :options.sync in v-data-table
   */
  const _buildSortQuery = (query, options) => {
    if (options.sortBy.length && options.sortDesc.length) {
      query.$sort = {};

      // Loop through each sorted field
      options.sortBy.forEach((sortField, index) => {
        query.$sort[sortField] = !options.sortDesc[index];
      });
    }
  };

  export default {
    name: 'Users',
    components: {
      UserAvatar,
      Panel,
    },
    data: () => {
      return {
        search: '',
        // ******* State options and pagination are tightly coupled...
        // ******* they help build the v-data-table for search
        options: cloneDeep(OPTIONS),
        pagination: cloneDeep(PAGINATION),
        headers: cloneDeep(Object.values(HEADERS)),
        listOfUsers: [],
        selectedUsers: [],
        appRoles: myApp.approles,
      };
    },
    computed: {
      ...get('users', ['loggedInUser']),
      ...sync('app', ['loading']),
      visibleHeaders() {
        return this.headers.filter((h) => h.display);
      },
    },
    async mounted() {
      await this.getUsers();
    },
    methods: {
      /**
       * isDefaultAdmin function
       *
       * This could be a computed but kept as a method
       * to be consistent with it's cousin isInstitutionUser(institution)
       *
       * @returns {Boolean} true|false
       */
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

      /**
       * isInstitutionUser(institution) function
       *
       * Takes in the institutuion object and compares it to the loggedInUsers organization Name
       * @param {Object} - Institution object
       */
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

        // Empty the set if we don't allow multiple
        if (!this.$myApp.allowMultipleRoles) {
          const role = user.roles.pop();
          user.roles = [role];
        }

        // Don't push what's already been selected.
        if (!alreadySelected) {
          this.selectedUsers.push(user);
        }
      },

      /**
       * getUsers function
       * @returns All the users from the selected institution
       */
      async getUsers() {
        this.listOfUsers = [];
        this.selectedUsers = [];

        try {
          this.loading = true;

          const query = {
            $limit: this.options.itemsPerPage,
            $skip: (this.options.page - 1) * this.options.itemsPerPage,
            appid: this.$myApp.azureAppID,
            soms_upn: {
              $search: this.search,
            },
          };
          _buildSortQuery(query, this.options);
          const users = await findAll(
            AccountsByApp,
            {
              query,
            },
            {
              type: 'JSON',
            }
          );
          // console.log('users: ', users);
          this.listOfUsers = users.data;
          this.pagination = {
            page: this.options.page,
            itemsPerPage: this.options.itemsPerPage,
            pageStart: (this.options.page - 1) * this.options.itemsPerPage,
            pageStop:
              (this.options.page - 1) * this.options.itemsPerPage +
              this.options.itemsPerPage,
            pageCount: Math.ceil(users.total / this.options.itemsPerPage),
            itemsLength: users.total,
          };

          return this.listOfUsers;
        } catch (error) {
          console.error('getUsers: ', error);
          this.listOfUsers = [];
          this.selectedUsers = [];
          return [];
        } finally {
          this.loading = false;
        }
      },

      /**
       * resetSort function
       * Makes an API call with the default sortBy and sortDesc set.
       */
      async resetSort() {
        this.options.sortBy = OPTIONS.sortBy;
        this.options.sortDesc = OPTIONS.sortDesc;
        await this.getUsers();
      },

      /**
       * resetColumns function
       * Sets the default display values for our headers
       */
      resetColumns() {
        this.headers = cloneDeep(Object.values(HEADERS));
      },

      /**
       * moveHeader function
       * Allows the re-ordering of headers within the table.
       * The newIndex is passed in to determine the new position
       */
      moveHeader(header, index, newIndex) {
        var temp = this.headers[newIndex]; // Hold the one above
        // Swap the two
        this.$set(this.headers, newIndex, header);
        this.$set(this.headers, index, temp);
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
      options: {
        handler: 'getUsers',
      },
    },
  };
</script>
