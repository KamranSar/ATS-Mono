<template>
  <v-container grid-list-md fluid>
    Home page
    <!-- <Footer absolute></Footer> -->
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
      getImgUrl(img) {
        return require('@/assets/' + img);
      },
      scrollTo: (hashtag) => {
        setTimeout(() => {
          location.href = hashtag;
        }, 1);
      },
    },

    head: {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'home',
          id: 'home',
          content: "Home's very real.",
        },
      ],
      link: [
        { rel: 'canonical', href: 'https://techformist.com/', id: 'canonical' },
      ],
    },
  };
</script>
