import feathers from '@/feathers/index.js';
import AccountsByApp from '@/feathers/services/accountsbyapp/accountsbyapp.service';
import { myApp } from '@/config/myApp.js';
import { findAll } from '@/feathers/helpers/index.js';

const actions = {
  // eslint-disable-next-line no-unused-vars
  init: async ({ rootState, state, dispatch }) => {
    //
  },

  getUsers: async () => {
    const query = {
      appid: myApp.cdcrAppID,
    };
    const users = await findAll(AccountsByApp, {
      query,
    });

    return users;
  },

  /**
   * Saves off the user object with the updated roles array embedded.
   *
   * @param {Object} user - An object with the _id and roles array at a minimum
   * @returns {Object} The updated user object from the appuserroles table
   */
  saveUserRoles: async (context, user) => {
    try {
      if (user.roles) {
        // Always patch, a new user will have an empty array of `roles`
        const response = await feathers
          .service('/api/auth/v1/appuserroles')
          .patch(user._id, {
            roles: user.roles,
          });
        return response;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default actions;
