/**
 * Navigation Mixin:
 * This Mixin populates the props, data, methods, and created event need for NavListItem and NavListGroup
 */
import onClick from '@/router/helpers/onClick.js';
import getRouterColor from '@/router/helpers/getRouterColor.js';
import checkRouteItems from '@/router/helpers/checkRouteItems.js';
import Install from '@/mixins/Install.js';
import Update from '@/mixins/Update.js';

export default {
  props: {
    toolbar: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mixins: [Install, Update],
  data() {
    return {
      anyRole: [], // Used for checkAnyRole
      allRoles: [], // Used for checkAllRoles
    };
  },
  methods: {
    onClick,
    getRouterColor,
  },
  computed: {
    currentItem() {
      return this.item ? this.item : this.group; // Handle case when prop is this.group
    },
    value() {
      if (this.currentItem.name === this.$route.name) {
        return true;
      } else if (this.$route.matched.length) {
        for (let count = 0; count < this.$route.matched.length; count++) {
          const match = this.$route.matched[count];
          if (match.name === this.currentItem.name) {
            return true;
          }
        }
      }

      return false;
    },
    /**
     * Computed helper to determine if the current user has the appropriate roles (if needed) to see the nav item.
     *
     * @returns {Boolean}
     */
    hasRoles() {
      const isUserLoggedIn = this.$store.getters['users/isUserLoggedIn'];

      // Don't show Login when user is logged in
      // Let the user Logout when logged in
      if (isUserLoggedIn) {
        if (this.currentItem.name === 'Login') {
          return false;
        } else if (this.currentItem.name === 'Logout') {
          return true;
        }
      } else if (!isUserLoggedIn) {
        // Allow the user to route to Login if they're logged out
        // Don't show logged out when user is logged out
        if (this.currentItem.name === 'Login') {
          return true;
        } else if (this.currentItem.name === 'Logout') {
          return false;
        }
      }

      let hasRoles = true;
      let routeItems = [this.currentItem];

      if (this.currentItem.children && this.currentItem.children.length) {
        routeItems.push(...this.currentItem.children);
      }

      hasRoles = checkRouteItems(routeItems, hasRoles);
      return hasRoles;
    },
    hasException() {
      const routedExceptions = [this.installItem.name, this.updateItem.name]; // Add other route names that woudld be excluded from the router guards here.
      if (routedExceptions.includes(this.currentItem.name)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
