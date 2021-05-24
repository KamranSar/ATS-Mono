<template>
  <v-container>
    This is a beautiful Users Management Screen.

    <!-- {{ user }}
    {{ appRoles }} -->
    {{ usersList }}
  </v-container>
</template>

<script>
  import useVuexPathify from '@/compositions/useVuexPathify';
  import myApp from '@/config/myApp';
  import Users from '@/feathers/Users';
  import { reactive } from '@vue/composition-api';

  export default {
    setup(props, context) {
      const { $store } = context.root;
      const { get } = useVuexPathify(context);
      const user = get('users/user');
      const appRoles = myApp.approles;
      const usersList = reactive([]);

      const getUser = async () => {
        await $store.set('app/loading', true);
        const users = await Users.find();
        await $store.set('app/loading', false);
        return users.data;
      };

      return {
        // Data
        appRoles,
        user,
        usersList,
        // Methods
        getUser,
      };
    },
    async mounted() {
      this.usersList = await this.getUser();
    },
  };
</script>
