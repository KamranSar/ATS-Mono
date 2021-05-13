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
      const { sync } = useVuexPathify(context);
      const FeathersAuthentication = sync('FeathersAuthentication', ['user']);
      return { ...FeathersAuthentication.value };
    },
  };
</script>
