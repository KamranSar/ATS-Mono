<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="dialogWidth"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
  >
    <v-card>
      <!-- Toolbar with icon, title, and close button -->
      <v-toolbar color="primary lighten-2" dark flat dense>
        <v-icon left>{{ icon }}</v-icon>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-btn small @click="dialog = false" icon>
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-toolbar>

      <v-row no-gutters align="center" justify="center">
        <!-- COLUMN 1 -->
        <v-col cols="12" lg="8" md="7" class="pa-2">
          <v-text-field
            v-model="searchUsers"
            :disabled="loading"
            prepend-icon="mdi-account"
            append-icon="mdi-magnify"
            label="Search users"
            single-line
            hide-details
            dense
            clearable
          ></v-text-field>

          <v-card-text>
            <v-data-table
              :items="usersFiltered"
              :headers="headers"
              :height="columnHeight"
              item-key="_id"
              disable-sort
            >
              <!-- Header: displayName -->
              <template v-slot:item.somsinfo.displayName="{ item }">
                <v-list-item dense class="px-0">
                  <v-list-item-avatar>
                    <UserAvatar :user="item" :showTooltip="true" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ getDisplayName(item) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item && item.soms_upn ? item.soms_upn : item.upn }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <!-- Header: appuserroles -->
              <template v-slot:item.appuserroles="{ item: user }">
                {{ user.roles.join(', ') }}
              </template>

              <!-- Header: actions -->
              <template v-slot:item.options="{ item: user }">
                <v-menu offset-y v-if="user.roles.length">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-tooltip
                      bottom
                      v-for="(button, i) in userActions()"
                      :key="i"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="button.onClick(user)"
                          v-on="on"
                          v-bind="attrs"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{
                              button.title
                            }}</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon>{{ button.icon }}</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                      </template>
                      {{ button.tooltip }}
                    </v-tooltip>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>

            <v-dialog v-model="removeDialog" width="500">
              <v-card>
                <v-card-title class="text-h5">
                  Unassign roles for {{ getDisplayName(userToReset) }}?
                </v-card-title>

                <v-card-text>
                  The user <b>{{ getDisplayName(userToReset) }}</b> currently
                  has the roles:

                  <div
                    v-if="
                      userToReset &&
                      userToReset.roles &&
                      userToReset.roles.length
                    "
                  >
                    {{ userToReset.roles.join(', ') }}
                  </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="removeDialog = false"> Cancel </v-btn>
                  <v-btn color="error" text @click="removeRoles()">
                    Remove
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-col>

        <v-divider vertical />

        <!-- COLUMN 2 -->
        <v-col cols="12" lg="4" md="5" class="pa-2">
          <!-- Search Roles -->
          <v-text-field
            v-model="searchRoles"
            :disabled="loading"
            prepend-icon="mdi-file-tree"
            append-icon="mdi-magnify"
            label="Search for or select a role"
            single-line
            hide-details
            dense
            clearable
            :class="MULTIPLE_USER_ROLES_ENABLED ? '' : 'mt-n6'"
          >
          </v-text-field>

          <!-- Append Overwrite Roles -->
          <v-row
            v-if="MULTIPLE_USER_ROLES_ENABLED"
            no-gutters
            justify="center"
            align="center"
          >
            <v-btn-toggle v-model="saveType" mandatory color="primary">
              <v-btn
                v-for="type in Object.keys(SAVE_TYPE)"
                small
                text
                :value="SAVE_TYPE[type].value"
                :key="type"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-on="on" v-bind="attrs">{{
                      SAVE_TYPE[type].text
                    }}</span>
                  </template>
                  {{ SAVE_TYPE[type].tooltip }}
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </v-row>

          <v-card-text>
            <v-treeview
              v-model="selectedRoles"
              :search="searchRoles"
              :items="appRoles"
              item-key="name"
              selection-type="independent"
              selected-color="primary lighten-2"
              transition
              open-all
              open-on-click
              selectable
              return-object
              activatable
              @input="onSelected"
              :style="`height: ${columnHeight + 3}px; max-height: ${
                columnHeight + 3
              }px; overflow-y: auto`"
            >
              <template v-slot:label="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on" v-bind="attrs">
                      <v-list-item-subtitle>
                        {{ item.name }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="caption font-italic">
                        {{ item.description }}
                      </v-list-item-subtitle>
                    </div>
                  </template>
                  <v-list-item-subtitle>
                    {{ item.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="caption font-italic">
                    {{ item.description }}
                  </v-list-item-subtitle>
                </v-tooltip>
              </template>
            </v-treeview>
          </v-card-text>

          <!-- Clear All Select All -->
          <v-row
            no-gutters
            :justify="MULTIPLE_USER_ROLES_ENABLED ? 'space-between' : 'end'"
            align="end"
          >
            <v-btn
              small
              text
              outlined
              color="primary"
              @click="selectedRoles = []"
            >
              Clear All</v-btn
            >

            <v-btn-toggle v-if="MULTIPLE_USER_ROLES_ENABLED">
              <v-btn
                small
                text
                outlined
                color="primary"
                @click="selectAllRoles()"
              >
                Select All</v-btn
              >

              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon color="primary" v-bind="attrs" v-on="on">
                    <v-icon> mdi-chevron-down</v-icon></v-btn
                  >
                </template>
                <v-list dense>
                  <v-list-item-group
                    v-model="selectAllType"
                    color="primary"
                    mandatory
                  >
                    <v-list-item
                      v-for="title in Object.keys(SELECT_TYPE)"
                      :key="title"
                      :value="SELECT_TYPE[title]"
                    >
                      <v-list-item-title
                        v-text="SELECT_TYPE[title]"
                      ></v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </v-btn-toggle>
          </v-row>
        </v-col>
      </v-row>

      <v-divider />

      <!-- DIALOG ACTIONS -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Cancel </v-btn>
        <v-btn color="primary" text class="ma-2" @click="onSaveRoles()">
          Save...
        </v-btn>
      </v-card-actions>

      <v-dialog v-model="saveDialog" width="500">
        <v-card>
          <v-card-title class="text-h5">Review Changes</v-card-title>

          <v-card-text class="pb-0">
            <v-autocomplete
              v-model="selectedUser"
              :items="users"
              return-object
              :item-text="'soms_upn' || 'upn'"
              auto-select-first
              label="Review changes to user roles"
              clearable
            >
            </v-autocomplete>

            <v-treeview
              v-if="selectedUser"
              :value="selectedUser.roles"
              :items="appRoles"
              item-key="name"
              selection-type="independent"
              selected-color="primary lighten-2"
              transition
              open-all
              open-on-click
              :style="`height: ${columnHeight + 3}px; max-height: ${
                columnHeight + 3
              }px; overflow-y: auto`"
            >
              <!-- Order shown matters -->
              <template v-slot:prepend="{ item, selected }">
                <!-- REMOVING -->
                <v-icon
                  v-if="rolesToRemove(selectedUser).includes(item.name)"
                  color="error"
                  >mdi-minus-box</v-icon
                >
                <!-- UNTOUCHED -->
                <v-icon v-else-if="selected" color="secondary"
                  >mdi-checkbox-marked</v-icon
                >
                <!-- ADDING -->
                <v-icon
                  v-else-if="rolesToAdd().includes(item.name)"
                  color="success"
                  >mdi-plus-box</v-icon
                >
              </template>

              <!-- Role Item -->
              <template v-slot:label="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on" v-bind="attrs">
                      <v-list-item-subtitle>
                        {{ item.name }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="caption font-italic">
                        {{ item.description }}
                      </v-list-item-subtitle>
                    </div>
                  </template>

                  <v-list-item-subtitle>
                    {{ item.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="caption font-italic">
                    {{ item.description }}
                  </v-list-item-subtitle>
                </v-tooltip>
              </template>
            </v-treeview>
            <v-row no-gutters justify="space-between" align="end" class="py-2">
              <!-- ADDING -->
              <span>
                <v-icon color="success">mdi-plus-box</v-icon>
                Adding
              </span>
              <!-- REMOVING -->
              <span><v-icon color="error">mdi-minus-box</v-icon> Removing</span>
              <!-- UNTOUCHED -->
              <span>
                <v-icon color="secondary">mdi-checkbox-marked</v-icon>
                Untouched
              </span>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="
                selectedUser = null;
                saveDialog = false;
              "
            >
              Cancel
            </v-btn>
            <v-btn color="primary" text @click="saveRoles()"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
  import { MULTIPLE_USER_ROLES_ENABLED } from '@/config/appFeatures.js';
  import UserAvatar from '@/components/util/UserAvatar.vue';
  import { get, sync, call } from 'vuex-pathify';
  import { SAVE_TYPE } from '@/components/Users/constants.js';

  const GENERIC_ERROR = 'Failed to update roles with unknown error.';

  const SELECT_TYPE = {
    TOP_LEVEL: 'Top level',
    ALL: 'All levels',
  };

  const HEADERS = [
    {
      text: 'Name',
      align: 'start',
      value: 'somsinfo.displayName',
    },
    {
      text: 'Current Roles',
      align: 'start',
      value: 'appuserroles',
    },
    { text: '', value: 'options' },
  ];

  export default {
    name: 'RolesDialog',
    props: {
      /**
       * The v-model passed in from the parent
       */
      value: {
        type: Boolean,
        default: false,
      },
      /**
       * An array of users selected from a list.
       *
       * If no users are passed in, then the assumption is all of the application users are desired.
       */
      users: {
        type: Array,
        required: false,
      },
    },
    components: {
      UserAvatar,
    },
    data: () => ({
      MULTIPLE_USER_ROLES_ENABLED,
      removeDialog: false,
      saveDialog: false,
      selectedUser: null,
      userToReset: {},
      title: 'Manage User Roles',
      icon: 'mdi-account-edit',
      searchUsers: '',
      searchRoles: '',
      selectedRoles: [],
      selectAllType: SELECT_TYPE.TOP_LEVEL,
      saveType: MULTIPLE_USER_ROLES_ENABLED ? null : SAVE_TYPE.OVERWRITE.value,
      SELECT_TYPE: Object.freeze(SELECT_TYPE),
      SAVE_TYPE: Object.freeze(SAVE_TYPE),
      headers: Object.freeze(HEADERS),
    }),
    computed: {
      ...sync('app', ['loading']),
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          /**
           * Emit the `input` event to update the v-model on the parent.
           *
           * @property {Boolean} value The updated state of the dialog, if open or closed.
           */
          this.$emit('input', value);
          this.selectedRoles = [];
        },
      },
      selectedUsers() {
        return this.users;
      },
      selectedUsersMap() {
        const selectedUsersMap = new Map();
        this.selectedUsers.map((user) => selectedUsersMap.set(user._id, user));
        return selectedUsersMap;
      },
      appRoles: get('users/getAppRoles'),
      appRolesMap: get('users/getAppRolesMap'),
      usersFiltered() {
        var users = this.users;
        var searchFilter = this.searchUsers && this.searchUsers.toLowerCase();
        if (searchFilter) {
          users = users.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(searchFilter) > -1;
            });
          });
        }
        return users;
      },
      dialogWidth() {
        if (this.$vuetify.breakpoint.lgAndUp) {
          return 900;
        } else if (this.$vuetify.breakpoint.mdAndUp) {
          return 800;
        } else {
          return 400;
        }
      },
      columnHeight() {
        return this.dialogWidth / 2;
      },
    },
    methods: {
      ...call('app', ['SET_SNACKBAR']),
      ...call('users', ['saveUserRoles']),
      /**
       * In the case for appFeatures MULTIPLE_USER_ROLES_ENABLED is true
       * Only allow the selection of one role from the tree
       */
      onSelected(data) {
        if (!MULTIPLE_USER_ROLES_ENABLED && data.length && data.length > 1) {
          data.shift();
        }
      },
      userActions() {
        return [
          {
            title: 'Apply all roles',
            tooltip: 'Select the current roles',
            icon: 'mdi-content-copy',
            onClick: (user) => this.selectUser({ item: user, value: true }),
          },
          {
            title: 'Remove roles...',
            tooltip: 'Remove the assigned roles',
            icon: 'mdi-delete-sweep-outline',
            onClick: (user) => this.onRemoveRoles(user),
          },
        ];
      },
      selectUser({ item, value }) {
        this.selectAllUsers({ items: [item], value });
      },
      selectAllUsers({ items, value }) {
        const rolesFromItems = new Map();
        items.forEach((user) => {
          user.roles.map((role) => {
            const appRole = this.appRolesMap.get(role);
            if (appRole) {
              rolesFromItems.set(role, appRole);
            }
          });
        });

        // Add them all to the list
        if (value) {
          this.selectedRoles.push(...rolesFromItems.values());
        } else {
          // Remove them all from the list, working backwards
          for (let count = this.selectedRoles.length - 1; count >= 0; count--) {
            const role = this.selectedRoles[count];
            if (rolesFromItems.has(role.name)) {
              this.selectedRoles.splice(count, 1);
            }
          }
        }
      },
      getDisplayName(user) {
        return user.somsinfo
          ? user.somsinfo.displayName
          : user.user && user.user.displayName
          ? user.user.displayName
          : user.upn;
      },
      selectAllRoles() {
        switch (this.selectAllType) {
          case SELECT_TYPE.ALL: {
            [...this.appRolesMap.values()].forEach((appRole) => {
              this.selectedRoles.push(appRole);
            });
            break;
          }

          default:
          case SELECT_TYPE.TOP_LEVEL: {
            this.appRoles.forEach((role) => {
              this.selectedRoles.push(role);
            });
            break;
          }
        }
      },
      rolesToAdd() {
        let rolesToAdd = [];
        if (this.selectedRoles && this.selectedRoles.length) {
          rolesToAdd = this.selectedRoles.map((role) => role.name);
        }
        return rolesToAdd;
      },
      rolesToRemove(user) {
        const rolesToRemove = [];
        if (
          this.saveType === SAVE_TYPE.OVERWRITE.value &&
          user &&
          user.roles &&
          user.roles.length
        ) {
          user.roles.forEach((role) => {
            if (!this.selectedRoles.map((r) => r.name).includes(role)) {
              rolesToRemove.push(role);
            }
          });
        }
        // console.log('remove: ', rolesToRemove);
        return rolesToRemove;
      },
      onRemoveRoles(user) {
        this.userToReset = user;
        this.removeDialog = true;
      },
      async removeRoles() {
        try {
          this.loading = true;
          this.userToReset.roles = [];
          const patchedUser = await this.saveUserRoles(this.userToReset);

          this.$emit('save', [patchedUser]);

          this.SET_SNACKBAR({
            bottom: true,
            center: true,
            message: `Removed all roles from ${
              patchedUser.user && patchedUser.user.displayName
                ? `<b>${patchedUser.user.displayName}</b>`
                : `<b>${patchedUser.upn}</b>`
            }`,
          });
        } catch (error) {
          this.SET_SNACKBAR({
            bottom: true,
            center: true,
            type: 'error',
            message: error && error.message ? error.message : GENERIC_ERROR,
          });
          console.error(error);
        } finally {
          this.loading = false;
          this.removeDialog = false;
        }
      },
      onSaveRoles() {
        const selectedRoles = this.selectedRoles.map((r) => r.name);
        if (!this.users.length || !selectedRoles.length) {
          this.SET_SNACKBAR({
            bottom: true,
            center: true,
            message: `Select at least one user and role.`,
          });
          return;
        }

        this.saveDialog = true;
      },
      /**
       * saveRoles function
       * Calls patch for the selected user to update their roles in appuserroles collection.
       */
      async saveRoles() {
        const selectedRoles = this.selectedRoles.map((r) => r.name);

        try {
          this.loading = true;
          const promiseArray = [];
          this.users.forEach((user) => {
            if (user.roles) {
              const newRoles = user.roles;
              selectedRoles.forEach((role) => {
                if (!user.roles.includes(role)) {
                  newRoles.push(role);
                }
              });

              user.roles =
                this.saveType === SAVE_TYPE.OVERWRITE.value
                  ? selectedRoles
                  : newRoles;
              promiseArray.push(this.saveUserRoles(user));
            }
          });

          const updatedUsers = await Promise.all(promiseArray);
          // console.log('updatedUsers: ', updatedUsers);

          /**
           * Triggers the parent component, Users.vue, to update its data-table
           *
           * @property {Object} updatedUsers The updated list of users
           */
          this.$emit('save', updatedUsers);
          this.loading = false;
        } catch (error) {
          /* eslint-disable-next-line */
          console.log('saveRoles(): ', error);
          this.SET_SNACKBAR({
            bottom: true,
            center: true,
            type: 'error',
            message: 'Failed to update user roles.',
          });
        } finally {
          this.loading = false;
          this.dialog = false;
        }
      },
    },
  };
</script>
