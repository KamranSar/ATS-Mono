<template>
  <v-row no-gutters>
    <v-col id="howitworks" cols="12">
      <HomeHero></HomeHero>
    </v-col>

    <v-container grid-list-md fluid>
      <v-col id="features" cols="12"></v-col>
      <v-col cols="12">
        <HomeFeatures></HomeFeatures>
      </v-col>
    </v-container>

    <v-col id="pricing" cols="12">Price Is Free!!!</v-col>
  </v-row>
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
