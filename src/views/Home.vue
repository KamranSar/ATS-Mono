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

    mounted() {
      if (this.$route.hash) {
        setTimeout(() => this.scrollTo(this.$route.hash), 1);
      }
    },

    methods: {
      scrollTo: (hashtag) => {
        setTimeout(() => {
          location.href = hashtag;
        }, 1);
      },
    },
  };
</script>
