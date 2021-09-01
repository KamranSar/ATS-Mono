import Vue from 'vue';
import roleCheck from '@/helpers/roleCheck.js';

/**
 * This is the vue-directive equivalent of our router guard hasAnyRoles (@/router/routers/hasAnyRoles.js)
 *
 * How To Use:
 * 1. Hard code the names of the roles to check for
 * <p v-has-any-roles="['System Administrator']"> foobar </p>
 *
 * - OR -
 *
 * 2. Pass in an array with the role names
 * <p v-has-any-roles="rolesToCheckFor"> foobar </p>
 */
const hasAnyRoles = {
  bind(el, binding) {
    let display = false; // Flag to determine whether the element is displayed or not (Play it safe, default to false)
    const roles = binding.value; // Grab the roles passed in from the value passed in

    display = roleCheck(roles, 'hasAnyRoles');
    // If we're not displaying, set display to 'none'
    // Otherwise don't touch the element
    if (!display) {
      el.style.display = 'none';
    }
  },
};

Vue.directive('has-any-roles', hasAnyRoles);
