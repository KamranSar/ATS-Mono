<template>
  <div>
    <v-alert
      class="text-center pl-3 pr-3 elevation-1"
      :value="!!alert['message']"
      :type="alert['type'] || type"
      @input="closeAlert"
    >
      {{ alert['message'] }}
    </v-alert>
  </div>
</template>

<script>
  import { reactive } from '@vue/composition-api';
  import useVuexPathify from '@/compositions/useVuexPathify';

  export default {
    setup(props, context) {
      const { sync } = useVuexPathify(context);
      const data = reactive({
        show: false,
        message: '',
        type: 'error',
      });

      const alert = sync('alert/alert');

      const closeAlert = () => {
        data.alert['message'] = '';
      };

      return {
        ...data,
        alert,
        closeAlert,
      };
    },
  };
</script>
