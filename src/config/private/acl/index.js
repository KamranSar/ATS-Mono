/**
 * Template provided acls to access user management.
 * Every application will require the 'admin' role
 */

export default (acl) => {
  // Only admin users can do admin-stuff
  // Can define app permissions using verbs
  acl.rule(
    'is-user-admin',
    (user) => user.approles && user.approles.includes('user-admin')
  );

  // For symantics in the router meta... can use { role: 'admin' }
  acl.rule(
    'is-admin',
    (user) =>
      user.approles &&
      (user.approles.includes('admin') ||
        user.approles.includes('user-admin') ||
        user.isapiadmin)
  );
};
