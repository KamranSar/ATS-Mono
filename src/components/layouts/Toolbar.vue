<template>
  <div>
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
          src="../../assets/img/logo.png"
          contain
          max-height="50px"
          max-width="50px"
        />
      </router-link>
      <span class="title ml-1">Awesome Monkey</span>
      <!-- <span class="caption grey--text text-lighten-5">beta</span> -->

      <v-spacer></v-spacer>
      <v-card color="transparent" class="hidden-md-and-down" flat>
        <v-btn-toggle group v-if="!isLoggedIn">
          <span v-for="item in anonNavItems" :key="item.title">
            <v-btn :href="item.to" text :key="item.title">
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

      <v-card color="transparent" flat v-if="isLoggedIn">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text icon v-on="on">
              <v-icon color="darker">mdi-account-circle</v-icon>
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
      <v-btn
        text
        v-if="rightDrawEnabled"
        @click="rightDrawOpen = !rightDrawOpen"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="leftDrawEnabled"
      v-model="leftDrawOpen"
      clipped
      hide-overlay
      app
    >
      <!-- Items are passed from here since we may want to reuse these at 
          toolbar level at some point in time -->
      <NavDrawerLeft
        :userItems="userItems"
        :adminItems="adminItems"
        :anonItems="anonItems"
        :anonNavItems="anonNavItems"
      ></NavDrawerLeft>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-if="rightDrawEnabled"
      v-model="rightDrawOpen"
      clipped
      hide-overlay
      app
      right
    >
      <NavDrawerRight title="Right side Drawer" icon="mdi-view-dashboard">
        <template v-slot:content>
          <v-list>
            <v-list-item v-for="n in 5" :key="n" link>
              <v-list-item-content>
                <v-list-item-title>Item {{ n }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
      </NavDrawerRight>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import { sync, get } from 'vuex-pathify';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        clippedLeft: true,
        clippedRight: true,
        anonNavItems: [
          { title: 'How it works?', to: '/#howitworks' },
          { title: 'Features', to: '/#features' },
          { title: 'Pricing', to: '/#pricing' },
        ],
        anonItems: [
          { title: 'Login', to: '/login', icon: 'mdi-fingerprint' },
          { title: 'Signup', to: '/signup', icon: 'mdi-account-box-outline' },
        ],
        userItems: [
          {
            icon: 'mdi-view-dashboard',
            title: 'Dashboard',
            to: '/dashboard',
            color: 'success',
          },
          {
            icon: 'mdi-book-plus',
            title: 'Service Request',
            to: '/sr',
          },
          {
            icon: 'mdi-bank',
            title: 'Partners',
            to: '/companies',
          },
        ],
        adminItems: [
          { icon: 'mdi-account-outline', title: 'Users', to: '/admin/users' },
          {
            icon: 'mdi-printer',
            title: 'Export Templates',
            to: '/admin/templates',
          },
        ],
        userToolbarItems: [
          { icon: 'mdi-folder-account', title: 'Account', to: '/my-account' },
          { icon: 'mdi-logout', title: 'Logout', to: '/logout' },
        ],
      };
    },
    computed: {
      ...mapGetters('authentication', ['isLoggedIn', 'registerEmail']),
      ...sync('userprefs', ['leftDrawOpen', 'rightDrawOpen']),
      ...get('appfeatures', ['leftDrawEnabled', 'rightDrawEnabled']),
    },
    methods: {
      ...mapActions('authentication', ['logout']),
    },

    components: {
      NavDrawerLeft: () =>
        import(
          /* webpackChunkName: "nav-drawer-left" */
          '@/components/layouts/NavDrawerLeft'
        ),
      NavDrawerRight: () =>
        import(
          /* webpackChunkName: "nav-drawer-right" */
          '@/components/layouts/NavDrawerRight'
        ),
    },
  };
</script>
<style scoped>
  .v-toolbar__extension {
    padding: 0px !important;
  }
</style>
