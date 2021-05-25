/** This file is imported by default in @/acl/index.js
 * Template provided acls to access user management.
 * Every application will require the 'admin' role
 * TODO: Update this to include user-admin or whatever we call it.
 */

export default (acl) => {
  // Only admin users can do admin-stuff
  // Can define app permissions using verbs
  acl.rule('is-user-admin', (user) => {
    if (user.isapiadmin) {
      return true;
    }

    if (user.approles && user.approles.length) {
      return user.approles.includes('user-admin');
    }
  });

  // For symantics in the router meta... can use { role: 'admin' }
  acl.rule('is-admin', (user) => {
    if (user.isapiadmin) {
      return true;
    }

    if (user.approles && user.approles.length) {
      let validated = false;
      ['admin', 'user-admin'].forEach((role) => {
        if (user.approles.includes(role)) {
          validated = true;
        }
      });

      return validated;
    }
  });
};
