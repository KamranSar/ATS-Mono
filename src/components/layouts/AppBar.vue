<template>
  <v-app-bar
    :clipped-left="clippedLeft"
    :clipped-right="clippedRight"
    flat
    app
    min-height="65"
  >
    <v-app-bar-nav-icon
      v-if="leftDrawEnabled"
      @click="leftDrawOpen = !leftDrawOpen"
    ></v-app-bar-nav-icon>

    <router-link :to="{ name: 'home' }">
      <v-img
        src="@/assets/logo.svg"
        contain
        max-height="40px"
        max-width="40px"
      />
    </router-link>

    <span class="title ml-1">Awesome Program Title</span>
    <!-- <span class="caption grey--text text-lighten-5">beta</span> -->

    <v-spacer></v-spacer>

    <v-card color="transparent" class="hidden-md-and-down" flat>
      <v-btn-toggle group v-if="!azureLoggedIn">
        <span v-for="item in anonNavItems" :key="item.title">
          <v-btn :to="item.to" text :key="item.title">
            {{ item.title }}
          </v-btn>
        </span>
        <span v-for="(item, index) in anonItems" :key="index">
          <v-btn :to="item.to" text :key="index">
            <v-icon color="item.iconColor">{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </span>
      </v-btn-toggle>
    </v-card>

    <v-card color="transparent" flat v-if="azureLoggedIn">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text icon v-on="on">
            <v-avatar v-if="myPhoto">
              <v-img max-height="32" max-width="32" :src="myPhoto"></v-img>
            </v-avatar>
            <v-icon v-else color="darker">mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in userToolbarItems"
            dense
            :key="index"
            :to="item.to"
          >
            <v-list-item-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>

    <v-btn text v-if="rightDrawEnabled" @click="rightDrawOpen = !rightDrawOpen">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import { sync, get } from 'vuex-pathify';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    props: {
      anonItems: {
        type: Array,
        required: true,
      },
      anonNavItems: {
        type: Array,
        required: true,
      },
      userItems: {
        type: Array,
        required: true,
      },
      adminItems: {
        type: Array,
        required: true,
      },
      userToolbarItems: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        clippedLeft: true,
        clippedRight: true,
      };
    },
    computed: {
      ...mapGetters('authentication', ['isLoggedIn', 'registerEmail']),
      ...sync('userprefs', ['leftDrawOpen', 'rightDrawOpen']),
      ...get('appfeatures', ['leftDrawEnabled', 'rightDrawEnabled']),
      ...get('azureAuthentication', {
        azureLoading: 'loading',
        myInfo: 'myInfo',
        myPhoto: 'myPhoto',
        myPhotoMetaData: 'myPhotoMetaData',
        localAccountId: 'localAccountId',
        displayName: 'displayName',
        azureLoggedIn: 'isLoggedIn',
      }),
    },
    methods: {
      ...mapActions('authentication', ['logout']),
    },

    components: {},
  };
</script>
<style scoped>
  .v-toolbar__extension {
    padding: 0px !important;
  }
</style>
