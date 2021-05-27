/** This file is imported by default in @/acl/index.js
 * Template provided acls to access user management.
 * Every application will require the 'admin' role
 */

export default (acl) => {
  // For symantics in the router meta... can use { role: 'admin' }
  acl.rule('if-admin', (user) => {
    if (user.isapiadmin) {
      return true;
    }

    let validated = false;
    if (user.approles && user.approles.length) {
      ['admin'].forEach((role) => {
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
      ['admin', 'user-manager'].forEach((role) => {
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
};
