<template>
  <div>
    <v-alert
      class="text-center pl-3 pr-3 elevation-1"
      :value="!!alert['message']"
      type="error"
      @input="closeAlert"
      dismissible
    >
      {{ alert['message'] }}
    </v-alert>
  </div>
</template>
<script>
  import useVuexPathify from '@/compositions/useVuexPathify';

  export default {
    setup(props, context) {
      const { sync } = useVuexPathify(context);

      const alert = sync('alert/alert');

      const closeAlert = () => {
        alert.value['message'] = '';
      };

      return {
        alert,
        closeAlert,
      };
    },
  };
</script>
