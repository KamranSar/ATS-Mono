<template>
  <div>This is a beautiful template</div>
</template>

<script>
  import { sync } from 'vuex-pathify';

  export default {
    computed: {
      ...sync('FeathersAuthentication', ['user']),
    },
  };
</script>
