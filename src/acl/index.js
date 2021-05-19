import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import Acl from 'vue-browser-acl';

const user = () => {
  return store.state.users.user;
};

const acls = (acl) => {
  // Only admin users can do admin-stuff
  acl.rule(
    'superadmin',
    (user) => user && (user.approles.includes('admin') || user.isapiadmin)
  );
  acl.rule('fluffy', (user) => user && user.approles.includes('fluffy'));
  acl.rule('is-cool', (user) => {
    console.log('User: ', user);
    return user && user.approles.includes('coolguy');
  });
  acl.rule(
    'fluffy-admin',
    (user) =>
      user &&
      (user.approles.includes('admin') || user.approles.includes('fluffy'))
  );
  acl.rule(
    'cool-admin',
    (user) =>
      user &&
      user.approles.includes('admin') &&
      user.approles.includes('coolguy')
  );
};

Vue.use(Acl, user, acls, { router });
