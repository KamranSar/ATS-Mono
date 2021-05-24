import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import Acl from 'vue-browser-acl';
import defaultAcls from '@/config/private/acl';

const user = () => (store.state.users.user ? store.state.users.user : null); // NOTE: Cannot do user = store.state.users.user; Must be evaluated.

const acls = (acl) => {
  defaultAcls(acl);
  /*  Add your own acls here...
  acl.rule('fluffy', (user) => user && user.approles.includes('fluffy'));
  acl.rule('is-cool', (user) => {
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
  ); */
};

Vue.use(Acl, user, acls, { router });
