<template>
  <v-banner
    v-if="deferredPrompt"
    single-line
    color="info"
    dark
    class="text-left"
    ><v-icon slot="icon" color="warning" size="36"> mdi-download </v-icon>
    Install the App

    <template v-slot:actions>
      <v-btn text @click="dismiss">Dismiss</v-btn>
      <v-btn text @click="install">Install</v-btn>
    </template>
  </v-banner>
</template>
<script>
  export default {
    name: 'Install',
    data() {
      return {
        deferredPrompt: null,
      };
    },
    created() {
      // Don't do anything if you're already installed (PWA)
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          // Stash the event so it can be triggered later.
          this.deferredPrompt = e;
        });
        window.addEventListener('appinstalled', () => {
          this.deferredPrompt = null;
        });
      } else {
        // Else go back to where you came from
        this.$router.push({ name: 'Home' });
      }
    },
    methods: {
      async dismiss() {
        this.deferredPrompt = null;
      },
      async install() {
        this.deferredPrompt.prompt();
      },
    },
  };
</script>
