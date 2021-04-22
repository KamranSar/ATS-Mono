<template>
  <v-container grid-list-md fluid>
    <v-row no-gutters>
      <v-col id="howitworks" cols="12">
        <HomeHero></HomeHero>
      </v-col>

      <v-col id="features" cols="12">
        <HomeFeatures></HomeFeatures>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',

    components: {
      HomeHero: () => import('../components/HomeHero'),
      HomeFeatures: () => import('../components/HomeFeatures'),
    },

    mounted() {
      if (this.$route.hash) {
        setTimeout(() => this.scrollTo(this.$route.hash), 1);
      }

      console.log(this.$vuetify);
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
