import Vue from 'vue';
import { roleCheck, HAS_ALL } from '@/helpers/roleCheck.js';

/**
 * This is the vue-directive equivalent of our router guard hasAllRoles (@/router/helper/hasAllRoles.js)
 *
 * How To Use:
 * 1. Hard code the names of the roles to check for
 * <p v-has-all-roles="['System Administrator', 'User Administrator', 'FooBar']"> foobar </p>
 *
 * - OR -
 *
 * 2. Pass in an array with the role names
 * <p v-has-all-roles="rolesToCheckFor"> foobar </p>
 */
const hasAllRoles = {
  bind(el, binding) {
    let display = true; // Flag to determine whether the element is displayed or not
    const roles = binding.value; // Grab the roles passed in from the value passed in

    display = roleCheck(roles, HAS_ALL);

    // If we're not displaying, set display to 'none'
    // Otherwise don't touch the element
    if (!display) {
      el.style.display = 'none';
    }
  },
};

Vue.directive('has-all-roles', hasAllRoles);
