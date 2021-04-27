<template>
  <v-container grid-list-md fluid>
    <v-row no-gutters>
      <v-col id="howitworks" cols="12">
        <Hero></Hero>
      </v-col>

      <v-col id="features" cols="12">
        <Features></Features>
      </v-col>
    </v-row>

    <Footer></Footer>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',

    components: {
      Hero: () => import('@/components/Home/Hero'),
      Features: () => import('@/components/Home/Features'),
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
