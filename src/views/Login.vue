<template>
  <Panel title="Login">
    <template slot="content">
      <v-container grid-list-md class="pt-5">
        <v-row justify="center">
          <v-col md="12" v-for="i in 5" :key="i + 't'"></v-col>

          <v-col cols="12" class="text-center">
            <MicrosoftLoginButton></MicrosoftLoginButton>
          </v-col>

          <v-col md="12" v-for="i in 2" :key="i + 'b'"> </v-col>
        </v-row>
      </v-container>
    </template>
  </Panel>
</template>

<script>
  export default {
    components: {
      Panel: () => import('@/components/layouts/Panel'),
      MicrosoftLoginButton: () =>
        import('@/config/private/components/SignInWithMicrosoftButton'),
    },
  };
</script>
