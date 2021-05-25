import myApp from '@/config/myApp.js';

/**
 * We need this because doing a users.find() returns all the users but without approles
 *
 * @param {*} context
 * @returns The context with approles appended to users
 */
async function getUserRoles(context) {
  const ROLES_SVC_PATH = '/api/auth/v1/appuserroles';
  const feathers = context.app;
  const users = context.result?.data;

  // Map the users by id and grab the keys
  const mappedUsers = new Map();
  users.forEach((user) => {
    mappedUsers.set(user._id, user);
  });
  const userIds = [...mappedUsers.keys()];

  // TODO: Will this path need to change for consistency?
  // TODO: Should I expect developers to run feathers distributed
  // TODO: for consitency of calling the /api/appname endpoint?

  if (feathers.service) {
    // Get the roles and add them to the user
    const roles = await feathers.service(ROLES_SVC_PATH).find({
      query: {
        userId: {
          $in: userIds,
        },
        appid: myApp.cdcrAppID,
      },
    });

    roles.data.forEach((role) => {
      const user = mappedUsers.get(role.userId);
      user.approles = role.roles;
      user.approleid = role._id;
    });
  }

  return context;
}

export { getUserRoles };
