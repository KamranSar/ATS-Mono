<template>
  <v-container fluid>
    <v-row justify="start" align="center">
      <template v-for="item in PREFERENCES">
        <v-col v-if="item.header" cols="12" :key="item.header">
          <v-subheader>
            <v-icon :color="item.color" left>{{ item.icon }}</v-icon
            >{{ item.header }}
          </v-subheader>
        </v-col>

        <v-col cols="12" md="6" v-else-if="item.label" :key="item.label">
          <v-list-item two-line>
            <v-switch
              @click="dirty = true"
              v-model="userPrefs[item.field]"
            ></v-switch>
            <v-list-item-content>
              <v-list-item-title v-html="item.label"></v-list-item-title>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-subtitle
                    v-on="on"
                    v-bind="attrs"
                    v-html="item.description"
                  ></v-list-item-subtitle>
                </template>
                <span class="white--text" v-html="item.description" />
              </v-tooltip>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </template>
    </v-row>

    <v-row justify="end" align="center">
      <v-btn
        :disabled="!dirty || loading"
        class="ma-2"
        color="primary"
        @click="onSaveUserPrefs()"
        :loading="loading"
        >Save Changes</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
  import { sync, call, get } from 'vuex-pathify';
  import { PREFERENCES } from '@/store/modules/userPrefs/index.js';
  export default {
    name: 'UserPreferences',
    data: () => ({
      PREFERENCES,
      dirty: false,
    }),
    computed: {
      ...get('app', ['loading']),
      userPrefs: sync('userPrefs'),
    },
    methods: {
      ...call('userPrefs', ['saveUserPrefs']),
      ...call('app', ['SET_SNACKBAR']),
      async onSaveUserPrefs() {
        try {
          await this.saveUserPrefs();
          this.dirty = false;

          this.SET_SNACKBAR({
            message: 'User preferences saved',
            bottom: true,
            center: true,
          });
        } catch (error) {
          this.SET_SNACKBAR({
            message: error.message,
            color: 'error',
            bottom: true,
            center: true,
            timeout: 30000,
          });
        }
      },
    },
  };
</script>
