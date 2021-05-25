<template>
  <v-avatar
    size="36px"
    :color="stringToColour(user ? userInitials : myInitials)"
  >
    <!-- If a user object is passed in then just display initials -->
    <span v-if="user" class="white--text">{{ userInitials }}</span>

    <!-- Otherwise display currently logged in user -->
    <v-img v-else-if="myPhoto" :src="myPhoto"></v-img>
    <span v-else class="white--text">{{ myInitials }}</span>
  </v-avatar>
</template>

<script>
  /**
   * If no user prop is passed in, component assumes
   * you want the currently logged in user.
   *
   * Returns the initials in an avatar if no photo available,
   * default behavior for user prop.
   */
  import useVuexPathify from '@/compositions/useVuexPathify';
  import { computed } from '@vue/composition-api';

  export default {
    name: 'UserAvatar',
    props: {
      user: { type: Object, required: false },
    },
    setup(props, context) {
      const { get } = useVuexPathify(context);

      const myPhoto = get('azureAuthentication/myPhoto');
      const myUser = get('users/user');
      const myInitials = computed(() => {
        return (
          String(myUser.value.lastname).charAt(0) +
          String(myUser.value.firstname).charAt(0)
        );
      });

      const userInitials = computed(() => {
        if (!props.user) return '';

        return (
          String(props.user.lastname).charAt(0) +
          String(props.user.firstname).charAt(0)
        );
      });

      /**
       * Helper function to generate a consistent HEX color given a seed
       * Author: Joe Freeman
       * Source: https://stackoverflow.com/a/16348977
       */
      var stringToColour = function (str) {
        if (!str) return '';
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var j = 0; j < 3; j++) {
          var value = (hash >> (j * 8)) & 0xff;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      };

      return {
        // Computed
        myUser,
        myPhoto,
        myInitials,
        userInitials,
        // Methods
        stringToColour,
      };
    },
  };
</script>
