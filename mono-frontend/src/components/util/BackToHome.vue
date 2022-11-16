<template>
  <div>
    <v-icon small color="primary" right>mdi-arrow-left</v-icon>
    <a
      class="text-decoration-none subtitle-2"
      @click="
        $router.push({
          name: 'Home',
        })
      "
    >
      Back to Home
    </a>
  </div>
</template>
