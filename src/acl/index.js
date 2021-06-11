import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import Acl from 'vue-browser-acl';
const user = () =>
  store.state.users.loggedInUser ? store.state.users.loggedInUser : null; // NOTE: Cannot do user = store.state.users.loggedInUser; Must be evaluated.

const acls = (acl) => {
  // For symantics in the router meta... can use { role: 'admin' }
  acl.rule('if-admin', (user) => {
    if (user.isapiadmin) {
      return true;
    }

    let validated = false;
    if (user.approles && user.approles.length) {
      const allowedRoles = ['admin'];

      allowedRoles.forEach((role) => {
        if (user.approles.includes(role)) {
          validated = true;
        }
      });
    }
    return validated;
  });

  // If user is at least a user-manager
  // Can define app permissions using verbs
  acl.rule('if-user-manager', (user) => {
    if (user.isapiadmin) {
      return true;
    }

    let validated = false;
    if (user.approles && user.approles.length) {
      const allowedRoles = ['admin', 'user-manager'];

      allowedRoles.forEach((role) => {
        if (user.approles.includes(role)) {
          validated = true;
        }
      });
    }
    return validated;
  });

  // If the user does not have any roles
  acl.rule('if-guest', (user) => {
    return user && (!user.approles || user.approles.length === 0);
  });

  // Add your own acls here...
  acl.rule(
    'if-example-role',
    (user) => user && user.approles && user.approles.includes('example-role')
  );
};

Vue.use(Acl, user, acls, { router });
