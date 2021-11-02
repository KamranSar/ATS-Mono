import { call } from 'vuex-pathify';

/**
 * Install Mixin:
 * This can be used by calling the install() method or displayed in a list item...
 * <v-list-item :item="installItem"></v-list-item>
 */
export default {
  data() {
    return {
      deferredPrompt: null,
      installedByPrompt: false, // Will always be false when already running in standalone Mode.
    };
  },
  computed: {
    /**
     * @returns A single RouteConfig object with a defined onClick event to install.
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
        this.installedByPrompt = true;
      });
    }
  },
  methods: {
    ...call('app', ['SET_SNACKBAR']),
    async install() {
      if (this.deferredPrompt && this.deferredPrompt.prompt) {
        await this.deferredPrompt.prompt();
      } else {
        setTimeout(() => {
          // Nothing happened?
          this.SET_SNACKBAR({
            bottom: true,
            message: `Nothing happened? Check app drawer if already installed.`,
            color: 'info',
          });
        }, 3000);
      }
    },
    // Add Install Item only if app is not already installed
    isRunningPWA() {
      return (
        ['fullscreen', 'standalone', 'minimal-ui'].some(
          (displayMode) =>
            window.matchMedia('(display-mode: ' + displayMode + ')').matches
        ) || this.installedByPrompt
      );
    },
  },
};
