<template>
  <div>
    <v-toolbar flat class="subtitle-2 grey--text" dense color="#ECEFF1">
      <span class="font-weight-bold text-truncate">
        <v-avatar class="mr-2" v-if="isAzureLoggedIn">
          <v-img
            v-if="myPhoto"
            max-height="46"
            max-width="46"
            :src="myPhoto"
          ></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <span>{{ displayName }}</span>
      </span>
    </v-toolbar>

    <v-list v-if="isAzureLoggedIn" dense>
      <v-list-item
        v-for="(item, i) in userItems"
        :key="i"
        :to="item.to"
        color="item.color"
      >
        <v-list-item-avatar>
          <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="body-2">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list v-else dense>
      <v-list-item v-for="(item, i) in anonymousItems" :key="i" :to="item.to">
        <v-list-item-avatar>
          <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            v-html="item.title"
            class="body-2"
          ></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <span v-if="isOrgAdmin" dense>
      <v-toolbar
        dense
        tile
        flat
        class="subtitle-2 mt-5 elevation-1"
        height="35"
      >
        <v-avatar class="mr-3">
          <v-icon disabled>mdi-account-key</v-icon>
        </v-avatar>
        <span class="grey--text">Admin</span>
      </v-toolbar>

      <v-list dense>
        <v-list-item v-for="(item, i) in adminItems" :key="i" :to="item.to">
          <v-list-item-avatar>
            <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              v-html="item.title"
              class="body-2"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </span>
  </div>
</template>

<script>
  import { get } from 'vuex-pathify';
  import { anonymousItems, userItems, adminItems } from '@/config/navItems';
  export default {
    name: 'NavDrawerLeft',
    computed: {
      ...get('azureAuthentication', {
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
        displayName: 'displayName',
        isAzureLoggedIn: 'isAzureLoggedIn',
      }),
      ...get('feathersAuthentication', {
        isFeathersLoggedIn: 'isFeathersLoggedIn',
        isAuthenticatePending: 'isAuthenticatePending',
        user: 'user',
        isOrgAdmin: 'isOrgAdmin',
      }),

      ...get('app', ['loading']),

      formattedUserId() {
        let userId = this.user && this.user.userid;
        if (userId && userId.length > 12)
          userId = `${this.user.userid.substr(0, 10)}..`;

        return userId;
      },
    },
    data() {
      return {
        anonymousItems,
        userItems,
        adminItems,
      };
    },
    methods: {
      goGo(to) {
        this.$router.push(to);
      },
    },
  };
</script>
