import Vuetify from 'vuetify';
import './global.scss';

// Vuetify instance to be applied to the Vue app instance
const vuetify = new Vuetify();

export default function (previewComponent) {
  return {
    vuetify,
    render(h) {
      return h(
        // Vuetify requires that elements are wrapped in v-app component
        'v-app',
        {
          props: {
            id: 'v-app',
          },
        },
        [h(Object.assign(previewComponent))]
      );
    },
  };
}
