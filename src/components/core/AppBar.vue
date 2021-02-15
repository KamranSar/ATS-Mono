<template>
  <v-app-bar app fixed color="canvas" :height="heightAppBar" style="z-index: 100">
    <v-app-bar-nav-icon>
      <v-progress-circular indeterminate @click="showLoadingSteps = true" />
      <v-dialog v-model="showLoadingSteps" scrollable max-width="300px">
        <v-card>
          <v-card-title class="loading">Loading</v-card-title>
          <v-card-text style="height: 300px"> </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success" text @click="showLoadingSteps = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar-nav-icon>
    <v-app-bar-nav-icon @click.stop="goBackOne" v-if="displayBackButton">
      <v-icon>fa-arrow-left</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>
      <portal-target name="AppBarTitle">{{ toolbarTitle }}</portal-target>
    </v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>

<script>
  /**
   * @group Components
   * The AppBar/Toolbar displayed across the top of all pages.
   */
  export default {
    name: 'AppBar',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      toolbarTitle: '',
      showLoadingSteps: false,
    }),
    computed: {
      heightAppBar() {
        return 64;
      },
      displayBackButton() {
        return false;
      },
    },
    methods: {
      goBackOne() {
        this.$router.go(-1);
      },
    },
    watch: {
      $route: {
        immediate: true,
      },
    },
  };
</script>

<style lang="css" scoped>
  /** Animated ellipsis... */
  .loading:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4, end) 900ms infinite;
    animation: ellipsis steps(4, end) 900ms infinite;
    content: '\2026'; /* ascii code for the ellipsis character */
    width: 0px;
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }
</style>
