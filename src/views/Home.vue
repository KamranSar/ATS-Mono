<template>
  <v-container grid-list-md fluid>
    Welcome Home
    <Footer id="footer" absolute></Footer>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',

    components: {
      Footer: () => import('@/components/layouts/Footer'),
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
