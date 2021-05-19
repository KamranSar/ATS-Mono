<template>
  <v-container>
    This is a beautiful Users Screen.
    {{ user }}
  </v-container>
</template>

<script>
  import useVuexPathify from '@/compositions/useVuexPathify';

  export default {
    setup(props, context) {
      const { get } = useVuexPathify(context);
      const user = get('users/user');
      return { user };
    },
  };
</script>
