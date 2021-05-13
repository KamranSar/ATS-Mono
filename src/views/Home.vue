<template>
  <v-container grid-list-md fluid>
    Welcome Home
    <Footer app></Footer>
  </v-container>
</template>

<script>
  import Footer from '@/components/layouts/Footer';
  export default {
    name: 'Home',
    components: {
      Footer,
    },
  };
</script>
