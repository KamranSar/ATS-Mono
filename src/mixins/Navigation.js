/**
 * Navigation Mixin:
 * This Mixin populates the props, data, methods, and created event need for NavListItem and NavListGroup
 */
import onClick from '@/router/helpers/onClick.js';
import getRouterColor from '@/router/helpers/getRouterColor.js';
import checkRouteItems from '@/router/helpers/checkRouteItems.js';
export default {
  props: {
    toolbar: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      value: null, // v-model value for v-list-item and v-list-group
      anyRole: [], // Used for checkAnyRole
      allRoles: [], // Used for checkAllRoles
    };
  },
  methods: {
    onClick,
    getRouterColor,
  },
  computed: {
    /**
     * Computed helper to determine if the current user has the appropriate roles (if needed) to see the nav item.
     *
     * @returns {Boolean}
     */
    hasRoles() {
      let hasRoles = true;
      const item = this.item ? this.item : this.group; // Handle case when prop is this.group
      let routeItems = [item];

      if (item.children && item.children.length) {
        routeItems.push(...item.children);
      }

      hasRoles = checkRouteItems(routeItems, hasRoles);
      return hasRoles;
    },
  },
};
