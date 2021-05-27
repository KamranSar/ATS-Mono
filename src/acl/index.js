import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import Acl from 'vue-browser-acl';
import defaultAcls from '@/config/private/acl/';

const user = () => (store.state.users.user ? store.state.users.user : null); // NOTE: Cannot do user = store.state.users.user; Must be evaluated.

const acls = (acl) => {
  defaultAcls(acl);
  // Add your own acls here...
  acl.rule(
    'if-example-role',
    (user) => user && user.approles && user.approles.includes('example-role')
  );
};

Vue.use(Acl, user, acls, { router });
