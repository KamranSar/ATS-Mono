import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import Acl from 'vue-browser-acl';
import { defaultAdminRole } from '@/config/myApp.js';

const user = () =>
  store.state.users.loggedInUser ? store.state.users.loggedInUser : null; // NOTE: Cannot do user = store.state.users.loggedInUser; Must be evaluated.

const acls = (acl) => {
  // If user is at least the defaultAdminRole
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

  // If the user does not have any roles
  acl.rule('if-guest', (user) => {
    return user && (!user.appuserroles || user.appuserroles.roles.length === 0);
  });
};

Vue.use(Acl, user, acls, { router });
