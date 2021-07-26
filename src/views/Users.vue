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

  const HEADERS = [
    /*   {
    text: string,
    value: string,
    align?: 'start' | 'center' | 'end',
    sortable?: boolean,
    filterable?: boolean,
    groupable?: boolean,
    divider?: boolean,
    class?: string | string[],
    cellClass?: string | string[],
    width?: string | number,
    filter?: (value: any, search: string, item: any) => boolean,
    sort?: (a: any, b: any) => number
  }, */
    {
      text: 'Name',
      align: 'start',
      value: 'somsinfo.displayName',
      display: {
        header: true,
        query: true,
      },
    },
    {
      text: 'User Principal Name',
      value: 'soms_upn',
      display: {
        header: true,
        query: true,
      },
    },
    {
      text: 'Institution Name',
      value: 'somsinfo.organizationName',
      display: {
        header: true,
        query: true,
      },
    },
    {
      text: 'Roles',
      value: 'appuserroles',
      align: 'start',
      display: {
        header: true,
        query: true,
      },
    },
    {
      text: 'Last Login',
      value: 'updatedAt',
      align: 'end',
      display: {
        header: true,
        query: true,
      },
    },
  ];

  const OPTIONS = {
    groupBy: [],
    groupDes: [],
    itemsPerPage: 10,
    multiSort: true,
    mustSort: false,
    page: 1,
    sortBy: ['updatedAt'],
    sortDesc: [true, true, true],
  };

  const PAGINATION = {
    page: 1,
    itemsPerPage: 10,
    pageStart: null,
    pageStop: null,
    pageCount: null,
    itemsLength: null,
  };

  /**
   * Set this to true if you want to get users by institution
   * Otherwise set to false to get users in the app.
   */
  import cloneDeep from 'lodash.clonedeep';
  import AccountsByApp from '@/feathers/services/accountsbyapp/accountsbyapp.service';
  export default {
    name: 'Users',
    components: {
      UserAvatar,
      Panel,
    },
    data: () => {
      return {
        search: '', // FIXME: Nurthin Aziz 2021-07-26: Currently does not work
        // ******* State options and pagination are tightly coupled...
        // ******* they help build the v-data-table for search
        options: OPTIONS,
        pagination: PAGINATION,
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
        return this.headers.filter((h) => h.display && h.display.header);
      },
    },
    async mounted() {
      this.listOfUsers = await this.getUsers();
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
            $sort: {
              soms_upn: 1,
            },
          };
          // _buildSortQuery(query, this.options); // FIXME: Nurthin Aziz 2021-07-26: Currently does not support $sort
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
      watch: {
        options: {
          handler: 'getUsers',
        },
      },
    },
  };
</script>
