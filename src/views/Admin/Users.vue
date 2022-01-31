<template>
  <Panel title="User Management">
    <template slot="content">
      <v-container fluid>
        <!-- Metric Cards -->
        <v-row justify="start" align="center" class="mb-2" no-gutters>
          <v-col
            cols="12"
            xl="3"
            lg="3"
            md="12"
            sm="12"
            class="ma-1"
            v-for="item in metricItems"
            :key="item.subtitle"
          >
            <v-card
              @click="item.onClick(item.subtitle)"
              :outlined="item.active"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="text-h5"
                    v-text="item.title"
                  ></v-card-title>

                  <v-card-subtitle v-text="item.subtitle"></v-card-subtitle>
                </div>

                <v-avatar class="ma-3" :color="item.color">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <!-- Users Table -->
        <v-data-table
          v-model="selectedUsers"
          :search="search"
          :items="filteredUserList"
          :disabled="loading"
          :loading="loading"
          :headers="visibleHeaders"
          :options.sync="options"
          loading-text="Loading... Please wait"
          :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
          :disable-pagination="loading"
          multi-sort
          show-select
          item-key="_id"
          selectable-key
          class="elevation-2"
        >
          <template v-slot:top>
            <v-row no-gutters class="pa-2">
              <!-- User Search Field -->
              <v-col :cols="$vuetify.breakpoint.mdAndDown ? 12 : 4"
                ><v-text-field
                  v-model="search"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  append-icon="mdi-magnify"
                  label="Search user"
                  single-line
                  hide-details
                  clearable
                >
                </v-text-field>
              </v-col>

              <v-spacer />

              <!-- Refresh Button -->
              <v-btn
                v-if="!CLIENT_ROLES_ENABLED"
                color="primary lighten-1"
                text
                @click="
                  search = '';
                  getUsers();
                "
                ><v-icon class="pr-1">mdi-refresh</v-icon>
                <span v-if="$vuetify.breakpoint.mdAndUp">Refresh Data</span>
              </v-btn>

              <!-- Bulk Manage Button -->
              <v-btn
                v-if="!CLIENT_ROLES_ENABLED"
                color="primary lighten-1"
                text
                @click.stop="showRolesDialog = true"
                ><v-icon class="pr-1">mdi-account-edit</v-icon>
                <v-badge
                  v-if="selectedUsers.length"
                  :content="selectedUsers.length"
                >
                  <span
                    v-if="$vuetify.breakpoint.mdAndUp"
                    v-html="selectedUsers.length ? MANAGE_SELECTED : MANAGE_ALL"
                  ></span>
                </v-badge>
                <span
                  v-else-if="$vuetify.breakpoint.mdAndUp"
                  v-html="selectedUsers.length ? MANAGE_SELECTED : MANAGE_ALL"
                ></span>
              </v-btn>

              <RolesDialog
                v-if="!CLIENT_ROLES_ENABLED"
                v-model="showRolesDialog"
                :users="selectedUsers.length ? selectedUsers : filteredUserList"
                @save="onSave"
              />

              <!-- Reset Sort Button -->
              <v-btn color="primary lighten-1" text @click="resetSort()"
                ><v-icon class="pr-1">mdi-sort-variant-remove</v-icon>
                <span v-if="$vuetify.breakpoint.mdAndUp">Reset Sort</span>
              </v-btn>

              <!-- Filter Columns Button -->
              <v-menu
                offset-y
                :close-on-content-click="false"
                max-height="350px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" color="primary lighten-1" text
                    ><v-icon class="pr-1">mdi-filter</v-icon>
                    <span v-if="$vuetify.breakpoint.mdAndUp"
                      >Columns</span
                    ></v-btn
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
            <UserAvatar :user="item" :showTooltip="true"></UserAvatar>
            <span class="ml-2">{{
              item.somsinfo ? item.somsinfo.displayName : item.user.displayName
            }}</span>
          </template>

          <!-- Header: soms_upn -->
          <template v-slot:item.soms_upn="{ item }">
            <div>
              <span class="text-lowercase">{{
                item.soms_upn || item.upn
              }}</span>
            </div>
          </template>

          <template v-slot:item.createdAt="{ item }">
            <div>
              <v-chip
                small
                v-if="item && item.createdAt"
                color="primary darken-1"
              >
                {{ formatDistanceToNow(item.createdAt) }}
              </v-chip>
              <v-chip v-else> Never </v-chip>
            </div>
          </template>

          <!-- Header: appsession -->
          <template v-slot:item.appsession="{ item }">
            <div>
              <v-chip
                small
                v-if="
                  item && item && item.appsession && item.appsession.updatedAt
                "
                color="primary darken-1"
              >
                {{ formatDistanceToNow(item.appsession.updatedAt) }}
              </v-chip>
              <v-chip v-else> Never </v-chip>
            </div>
          </template>

          <!-- Header: emailAddress -->
          <template v-slot:item.user.emailAddress="{ item }">
            <div>
              <span class="text-lowercase">{{ item.user.emailAddress }}</span>
            </div>
          </template>

          <!-- Header: roles -->
          <template v-slot:item.roles="{ item: user }">
            <v-row no-gutters justify="center" align="center">
              <v-col>
                <!-- Remove ternary and keep second condition when CLIENT_ROLES_ENABLED preference is removed -->
                <v-autocomplete
                  v-model="user.roles"
                  :items="
                    CLIENT_ROLES_ENABLED
                      ? appRoles
                      : appRoles.filter((r) => user.roles.includes(r.name))
                  "
                  chips
                  no-data-text="No roles have been assigned..."
                  label="Assigned Roles"
                  item-text="name"
                  item-value="name"
                  multiple
                  hide-details
                  small-chips
                >
                  <!-- Remove this template and keep fallback when CLIENT_ROLES_ENABLED is removed -->
                  <template
                    v-if="CLIENT_ROLES_ENABLED"
                    v-slot:item="{ item: role }"
                  >
                    <v-list-item
                      @click="setSelectedUser(user, role)"
                      :disabled="role.disabled"
                    >
                      <v-list-item-action>
                        <v-checkbox
                          :input-value="user.roles.includes(role.name)"
                          :on-icon="
                            MULTIPLE_USER_ROLES_ENABLED
                              ? 'mdi-checkbox-marked'
                              : 'mdi-radiobox-marked'
                          "
                          :off-icon="
                            MULTIPLE_USER_ROLES_ENABLED
                              ? 'mdi-checkbox-blank-outline'
                              : 'mdi-radiobox-blank'
                          "
                        ></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>{{ role.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          role.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-else v-slot:item="{ item: role }">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>{{ role.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          role.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="auto" v-if="!CLIENT_ROLES_ENABLED">
                <v-btn icon @click="manageSelected(user)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <!-- Header: workAssignment -->
          <template v-slot:item.somsinfo.workAssignment="{ item }">
            <div>
              {{ item && item.somsinfo ? item.somsinfo.workAssignment : '' }}
              {{ item && item.somsinfo ? ' - ' : '' }}
              {{
                item && item.somsinfo
                  ? item.somsinfo.workAssignmentDescription
                  : ''
              }}
            </div>
          </template>

          <!-- Header: staffType -->
          <template v-slot:item.somsinfo.staffType="{ item }">
            <div>
              {{ item && item.somsinfo ? item.somsinfo.staffType : '' }}
              {{ item && item.somsinfo ? ' - ' : '' }}
              {{
                item && item.somsinfo ? item.somsinfo.staffTypeDescription : ''
              }}
            </div>
          </template>
        </v-data-table>
        <!-- Remove this whole row when CLIENT_ROLES_ENABLED is removed -->
        <!-- Reset and Save Roles Button -->
        <v-row no-gutters v-if="CLIENT_ROLES_ENABLED">
          <v-btn
            color="secondary"
            class="mt-2"
            @click="resetRoles()"
            :disabled="loading"
          >
            <span v-if="$vuetify.breakpoint.mdAndUp">Reset Roles</span>
            <v-icon :right="$vuetify.breakpoint.mdAndUp" dark>
              mdi-refresh
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!selectedUsers.length || loading"
            color="primary"
            class="mt-2 white--text"
            @click="saveRoles()"
          >
            <span v-if="$vuetify.breakpoint.mdAndUp"> Save Roles </span>
            <v-icon :right="$vuetify.breakpoint.mdAndUp" dark>
              mdi-cloud-upload
            </v-icon>
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
  import debugModule from 'debug';
  const debug = new debugModule(
    `${process.env.VUE_APP_NAME}:` + 'views:Admin:Users'
  );
  import feathers from '@/feathers/index.js';
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import { formatDistanceToNow, parseISO, isThisWeek } from 'date-fns';
  import Panel from '@/components/layouts/Panel.vue';
  import { get, sync, call } from 'vuex-pathify';
  import {
    CLIENT_ROLES_ENABLED,
    MULTIPLE_USER_ROLES_ENABLED,
  } from '@/config/appFeatures.js';
  import { HEADERS, OPTIONS } from '@/components/Users/constants.js';
  import cloneDeep from 'lodash.clonedeep';
  import RolesDialog from '@/components/Users/RolesDialog.vue';

  export default {
    name: 'Users',
    components: {
      UserAvatar,
      Panel,
      RolesDialog,
    },
    data: () => {
      return {
        CLIENT_ROLES_ENABLED,
        MULTIPLE_USER_ROLES_ENABLED,
        MANAGE_SELECTED: 'Manage Selected',
        MANAGE_ALL: 'Manage All',
        search: '',
        // ******* State options and pagination are tightly coupled...
        // ******* they help build the v-data-table for search
        options: cloneDeep(OPTIONS),
        headers: cloneDeep(Object.values(HEADERS)),
        listOfUsers: [],
        filteredUserList: [],
        selectedUsers: [],
        metricItems: [
          /**
           * {
           *  title: String, // 1,337
           *  subtitle: String, // Total Users
           *  icon: String, // mdi-account
           *  color: String // primary lighten-2
           * }
           */
        ],
        showRolesDialog: false,
      };
    },
    computed: {
      ...get('users', ['loggedInUser']),
      ...sync('app', ['loading']),
      appRolesMap: get('users/getAppRolesMap'),
      appRoles() {
        debug(this.appRolesMap);
        return [...this.appRolesMap.values()];
      },
      visibleHeaders() {
        return this.headers.filter((h) => h.display);
      },
    },
    async mounted() {
      await this.getUsers();
    },
    beforeRouteLeave(to, from, next) {
      this.filteredUserList = [];
      next();
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('users', ['saveUserRoles']),
      /**
       * @param user - The selected user in listOfUsers
       * @deprecated >v0.6.0 vue-frontend-template
       */
      setSelectedUser(user, role) {
        const alreadySelected = this.selectedUsers.find((u) => {
          return u.userId === user.userId;
        });
        const roleSelected = user.roles.indexOf(role.name);
        if (roleSelected === -1) {
          user.roles.push(role.name);
        } else {
          user.roles.splice(roleSelected, 1);
        }

        // Empty the set if we don't allow multiple
        if (!MULTIPLE_USER_ROLES_ENABLED && user.roles.length) {
          user.roles = [role.name];
        }

        // Don't push who's already been selected.
        if (!alreadySelected) {
          this.selectedUsers.push(user);
        }
      },
      manageSelected(user) {
        this.selectedUsers = [];
        this.selectedUsers.push(user);
        this.showRolesDialog = true;
      },
      /**
       * onSave function
       * This takes the emitted data from RolesDialog when save is called
       * then loops through the filteredUserList and to update with the given data.users Map
       */
      async onSave(users) {
        this.loading = true;

        // Track the user ids to update
        const usersToUpdate = users.map((u) => u._id);

        // Loop through all users
        this.filteredUserList.forEach((userFromList) => {
          // Find the index by user _id in our tracked list
          const userIndexFromMap = usersToUpdate.findIndex(
            (id) => id === userFromList._id
          );

          if (userIndexFromMap !== -1) {
            // Update the DOM to reflect the change
            this.$set(userFromList, {
              ...users[userIndexFromMap],
              user: userFromList.user,
            });

            // Remove that user from our tracked list
            usersToUpdate.splice(userIndexFromMap, 1);
          }

          // Return once we've udpated everyone
          if (!usersToUpdate.length) {
            return;
          }
        });
        this.loading = false;
      },
      /**
       * @param date - A valid date object or string
       * @returns A human readable date comparison.
       */
      formatDistanceToNow(date) {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      },

      /**
       * getUsers function
       * @returns All the users from the selected institution
       */
      async getUsers() {
        this.listOfUsers = [];
        this.filteredUserList = [];
        this.selectedUsers = [];

        try {
          this.loading = true;

          // To avoid name conflicts... calling getUsers action with a $store.dispatch()
          const response = await this.$store.dispatch('users/getUsers');
          debug('response: ', response);
          this.listOfUsers = response.data;
          this.filteredUserList = this.listOfUsers;

          this.buildMetricItems(response);

          return this.filteredUserList;
        } catch (error) {
          // console.error('getUsers: ', error);
          this.filteredUserList = [];
          this.selectedUsers = [];
          return [];
        } finally {
          this.loading = false;
        }
      },

      /**
       * Builds the metricItems data array using the users object passed from getUsers
       */
      buildMetricItems(users) {
        let unassignedCount = 0;
        let activeThisWeekCount = 0;
        if (users && users.data && users.data.length) {
          users.data.forEach((u) => {
            if (!u.roles.length) {
              unassignedCount++;
            }
            if (
              u.appsession &&
              u.appsession.updatedAt &&
              isThisWeek(parseISO(u.appsession.updatedAt))
            ) {
              activeThisWeekCount++;
            }
          });
        }

        const _setOptionsHeaders = (field, desc = true) => {
          this.options.sortBy = [field];
          this.options.sortDesc = [desc];
          this.headers.forEach((h) => {
            if (h.value === field) {
              h.display = true;
              return;
            }
          });
        };
        const _toggleActive = (subtitle) => {
          let toggledItem;
          this.metricItems.forEach((item) => {
            if (item.subtitle === subtitle) {
              toggledItem = item;
            }

            item.active = Boolean(item.subtitle === subtitle) && !item.active;
          });

          return toggledItem && toggledItem.active;
        };

        const _showAll = () => {
          this.filteredUserList = this.listOfUsers;
          this.resetSort();
          this.resetColumns();
        };

        this.metricItems = [
          {
            title: users.total,
            subtitle: 'Total Users',
            icon: 'mdi-account-outline',
            color: 'primary lighten-4',
            active: false,
            onClick: () => {
              _toggleActive();
              _showAll();
            },
          },
          {
            title: unassignedCount,
            subtitle: 'Unassigned',
            icon: 'mdi-account-cog-outline',
            color: 'info darken-1',
            active: false,
            onClick: (subtitle) => {
              const ROLE_FIELD = 'roles';
              const active = _toggleActive(subtitle);
              if (active) {
                this.filteredUserList = this.listOfUsers;
                this.filteredUserList = this.filteredUserList.filter(
                  (u) => !u.roles.length
                );
                _setOptionsHeaders(ROLE_FIELD);
              } else {
                _showAll();
              }
            },
          },
          // {
          //   title: this.filteredUserList.filter((u) => u.disabled).length,
          //   subtitle: 'Disabled',
          //   icon: 'mdi-account-cancel-outline',
          //   color: 'secondary lighten-2',
          // },
          {
            title: activeThisWeekCount,
            subtitle: 'Active this week',
            icon: 'mdi-account-check-outline',
            color: 'warning',
            active: false,
            onClick: (subtitle) => {
              const SESSION_FIELD = 'appsession';
              const active = _toggleActive(subtitle);
              if (active) {
                this.filteredUserList = this.listOfUsers;
                this.filteredUserList = this.filteredUserList.filter(
                  (u) =>
                    u.appsession &&
                    u.appsession.updatedAt &&
                    isThisWeek(parseISO(u.appsession.updatedAt))
                );
                _setOptionsHeaders(SESSION_FIELD, false);
              } else {
                _showAll();
              }
            },
          },
        ];
      },

      /**
       * resetSort function
       * Makes an API call with the default sortBy and sortDesc set.
       */
      async resetSort() {
        this.options.sortBy = OPTIONS.sortBy;
        this.options.sortDesc = OPTIONS.sortDesc;
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
       * @deprecated >v0.6.0 vue-frontend-template
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
              /* eslint-disable-next-line */
              console.error(error);
              user.roles = [];
            }
          }

          this.selectedUsers = [];
        } catch (error) {
          /* eslint-disable-next-line */
          debug('resetRoles error: ', error);
        } finally {
          this.loading = false;
        }
      },

      /**
       * saveRoles function
       * Calls either a patch or create for the selected user to update their roles in appuserroles collection.
       * @deprecated >v0.6.0 vue-frontend-template
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
          /* eslint-disable-next-line */
          debug('SaveRoles: ', error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
