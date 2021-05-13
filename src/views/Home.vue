<template>
  <v-container grid-list-md fluid>
    Welcome Home
    <Footer app></Footer>
  </v-container>
</template>

<script>
  import Footer from '@/components/layouts/Footer';
  import { onMounted } from '@vue/composition-api';
  export default {
    name: 'Home',
    components: {
      Footer,
    },
    setup(props, context) {
      const { $router } = context.root;
      onMounted(() => {
        const { hash } =
          $router && $router.history && $router.history.current
            ? $router.history.current
            : '';
        if (hash) {
          setTimeout(() => this.scrollTo(hash), 1);
        }
      });

      const scrollTo = (hashtag) => {
        setTimeout(() => {
          location.href = hashtag;
        }, 1);
      };

      return { scrollTo };
    },
  };
</script>
