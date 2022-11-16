<template>
  <router-view></router-view>
</template>

<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (to && to.name === 'Maintenance') {
        next({ name: 'Destinations' });
      } else {
        next();
      }
    },
  };
</script>
