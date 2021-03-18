// https://vuex.feathersjs.com/getting-started.html#auth-plugin
// https://vuex.feathersjs.com/auth-plugin.html#configuration

import { makeAuthPlugin } from '@/feathers-client';

export default makeAuthPlugin({ userService: 'users' });
