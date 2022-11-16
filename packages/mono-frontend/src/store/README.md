In the templates `/store` folder you'll immediately see 2 things...
`index.js` - The file that gets created when you create a vue project with vuex added.
`modules/` - This folder holds all the vuex modules already available for usage.
`modules/apps.js` - This module holds a lot of underlying `actions` used to pop up an `ALERT` or a `SNACKBAR`
`modules/devicePrefs.js` - This module holds an expandable list of preferences saved on the device such as theme settings.
`modules/userPrefs/index.js` - This module holds an expandable list of preferences saved **per user** in the MT such as whether to follow their device theme instead.
`modules/users/index.js` - The users module holds the state for the `loggedInUser` as well as well as some `getters` to `getAppUserRoles`, `getUserPrefs` or check `isUserLoggedIn`.
