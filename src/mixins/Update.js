/**
 * Update Mixin:
 * This can be used by calling the update() method or displayed in a list item...
 * <v-list-item :item="updateItemm"></v-list-item>
 *
 * Source: https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip
 */
export default {
  data() {
    return {
      refreshing: false,
      registration: null,
      updateExists: false,
    };
  },
  computed: {
    /**
     * @returns A single VueRouter object with a defined onClick event to update.
     */
    updateItem() {
      return {
        icon: 'mdi-new-box',
        color: 'success',
        path: '',
        name: 'Update App',
        onClick: () => {
          this.update();
        },
      };
    },
  },
  created() {
    // Listen for an updated sw
    document.addEventListener('swUpdated', this.updateAvailable, {
      once: true,
    });

    // Only during a refresh
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },
  methods: {
    // Store the nnew service worker and mmake update available
    updateAvailable(event) {
      this.registration = event.detail;
      this.updateExists = true;
      // console.log({ event });
      // console.log('Registration: ', this.registration);
      // console.log('updateExists: ', this.updateExists);
    },

    update() {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) return;
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },
  },
};
