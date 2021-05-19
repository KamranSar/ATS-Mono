<template>
  <v-container>
    This is a beautiful Users Management Screen.

    {{ user }}
    {{ appRoles }}
  </v-container>
</template>

<script>
  import useVuexPathify from '@/compositions/useVuexPathify';
  import myApp from '@/config/myApp';
  export default {
    setup(props, context) {
      const { get } = useVuexPathify(context);
      const user = get('users/user');
      const appRoles = myApp.approles;
      return { appRoles, user };
    },
  };
</script>
