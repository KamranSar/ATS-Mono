# Directory Structure :open_file_folder:

Below outlines the default directory structure the template comes with:

```

.
├── docs - `npm run docs` to run Documentation
├── public
│   └── img
│       └── icons - Application Logo
├── scripts - Script to resize your png or svg to icon sizes needed.
└── src - Application Code
    ├── components - Vue components live here
    │   ├── layouts
    │   │   └── navigation - Navigation Helper Components
    │   └── util - Alert, AppLogo, Snackbar, UserAvatar...
    ├── compositions - Vue 3 ready composition functions
    ├── config - Application configuration folder (myApp.js)
    │   └── private - Underlying template code available for use but.. DO NOT MODIFY
    │       ├── components
    │       ├── helpers
    │       ├── router - Default routes
    │       └── store
    │           ├── modules
    │           │   └── azure
    │           └── plugins
    ├── directives
    │   ├── v-has-all-roles
    │   └── v-has-any-roles
    ├── feathers - Exported feathers services
    │   ├── helpers - findAll helper
    │   └── services
    ├── helpers - toTitleCase, hasARole, roleCheck...
    ├── mixins - PWA Install Mixin
    ├── plugins - Plugins live here (Vuetify.js)
    ├── router - Vue Router folder
    │   ├── guards - hasAnyRoles, hasAllRoles...
    │   └── helpers
    ├── store - Vuex State Management Store
    │   ├── modules
    │   └── plugins - vuex-pathify, vuex-perist...
    ├── styles - Roboto-fonts.css
    └── views - Router Views (See router/navItems.js)
        └── Admin - User Management Page

```
