/**
 * Install Mixin:
 * This can be used by calling the install() method or displayed in a list item...
 * <v-list-item :item="installItem"></v-list-item>
 */
export default {
  data() {
    return {
      deferredPrompt: null,
    };
  },
  computed: {
    /**
     * @returns A single VueRouter object with a defined onClick event to install.
     */
    installItem() {
      return {
        icon: 'mdi-download',
        color: 'primary',
        path: '',
        name: 'Install App',
        onClick: () => {
          this.install();
        },
      };
    },
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
    async install() {
      if (this.deferredPrompt && this.deferredPrompt.prompt) {
        await this.deferredPrompt.prompt();
      } else {
        setTimeout(() => {
          // Nothing happened?
          this.$store.dispatch('snackbar/setSnack', {
            message: `Nothing happened? Check app drawer if already installed.`,
            color: 'info',
          });
        }, 3000);
      }
    },
    // Add Install Item only if app is not already installed
    isRunningPWA() {
      return ['fullscreen', 'standalone', 'minimal-ui'].some(
        (displayMode) =>
          window.matchMedia('(display-mode: ' + displayMode + ')').matches
      );
    },
  },
};
