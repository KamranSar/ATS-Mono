/**
 * Access Control Lists:
 * Use this file if you need more granular control over your app
 * beyond just what role(s) a user has when they log in.
 *
 * *See the following sections in the HOWTO.md for more info*
 * ## Adding roles to your App
 * ## Assigning roles to users
 * ## Creating ACLS to work with your roles
 * ## Using roles to protect your app
 */

import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import Acl from 'vue-browser-acl';
import { defaultAdminRole } from '@/config/myApp.js'; // The highest role defined in the app

const user = () =>
  store.state.users.loggedInUser ? store.state.users.loggedInUser : null; // NOTE: Cannot do user = store.state.users.loggedInUser; Must be evaluated.

const acls = (acl) => {
  /**
   * if-user-admin
   * This serves JUST as an example.
   * It does not get used in the app
   *
   * Rule to only allow a user if they are an admin.
   */
  acl.rule('if-user-admin', (user) => {
    let validated = false;
    const allowedRoles = [defaultAdminRole.name];

    if (user.appuserroles && user.appuserroles.roles.length) {
      allowedRoles.forEach((role) => {
        if (user.appuserroles.roles.includes(role)) {
          validated = true;
        }
      });
    }

    return validated;
  });

  /**
   * if-guest
   * This serves JUST as an example
   * It does not get used in the app
   *
   * Rule to allow a user with no roles.
   */
  acl.rule('if-guest', (user) => {
    return user && (!user.appuserroles || user.appuserroles.roles.length === 0);
  });
};

Vue.use(Acl, user, acls, { router });
