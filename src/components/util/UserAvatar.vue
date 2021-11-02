<template>
  <v-tooltip top v-if="showTooltip">
    <template v-slot:activator="{ on, attrs }">
      <v-avatar
        size="36px"
        :color="
          stringToColor(
            user
              ? user.user
                ? user.user.displayName
                : user.displayName
              : myUser.displayName
          )
        "
        v-bind="attrs"
        v-on="on"
      >
        <!-- If a user object is passed in then just display initials -->
        <span v-if="user" class="white--text">{{ userInitials }}</span>

        <!-- Otherwise display currently logged in user -->
        <v-img v-else-if="myPhoto" :src="myPhoto"></v-img>
        <span v-else class="white--text">{{ myInitials }}</span>
      </v-avatar>
    </template>
    <span>{{
      user
        ? user.user
          ? user.user.displayName
          : user.displayName
        : myUser.displayName
    }}</span>
  </v-tooltip>
  <v-avatar
    v-else
    size="36px"
    :color="
      stringToColor(
        user
          ? user.user
            ? user.user.displayName
            : user.displayName
          : myUser.displayName
      )
    "
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
   *
   * Example:
   * import UserAvatar from "@/components/util/UserAvatar.vue";
   * <UserAvatar :user="user"></UserAvatar>
   */
  import useVuexPathify from '@/compositions/useVuexPathify';
  import stringToColor from '@/helpers/stringToColor.js';
  import { computed } from '@vue/composition-api';

  export default {
    name: 'UserAvatar',
    props: {
      user: { type: Object, required: false },
      showTooltip: { type: Boolean, required: false, default: false },
    },
    setup(props, context) {
      const { get } = useVuexPathify(context);
      const myPhoto = get('azureAuthentication/myPhoto');
      const myUser = get('users/loggedInUser');
      const user = props.user;

      const myInitials = computed(() => {
        return (
          String(myUser.value.lastName).charAt(0) +
          String(myUser.value.firstName).charAt(0)
        );
      });

      const userInitials = computed(() => {
        if (!user) return '';
        const userObj = user.user ? user.user : user;
        return (
          String(userObj.lastName).charAt(0) +
          String(userObj.firstName).charAt(0)
        );
      });

      return {
        // Computed
        myUser,
        myPhoto,
        myInitials,
        userInitials,
        // Methods
        stringToColor,
      };
    },
  };
</script>
