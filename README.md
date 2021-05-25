# cdcr-client-template

## What is this?

This repository is a starter project based on -

1. Vue CLI
2. Vuex + Pathify
3. Vuetify + standard layouts + dashboard
4. Feathers client for APIs
5. vue-browser-acl for ACLs

The objective is to keep things simple for simple client/server projects.

## Project setup

### Setup your local backend

If you haven't already... setting up a backend is easy.

```sh
git clone https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/api-router-template
cd api-router-template
npm install
cd scripts
./start_db.sh
npm run dev
```

Now back in your `cdcr-client-template` folder

```sh
npm install
npm run serve
# See HOWTO.md on starting your development.
```

### Compiles and minifies for production and PWA testing

```
npm run build
```

## Directory Structure

Below outlines the default directory structure the template comes with:

```
.
├── src - Application Code
│   ├── acl - vue-browser-acl folder
│   ├── components - Vue components live here
│   │   ├── layouts
│   │   │   └── navigation
│   │   │       └── helpers
│   │   └── util
│   ├── compositions - Vue 3 ready composition functions
│   ├── config - Application configuration folder
│   │   └── private - Underlying template code available for use but.. DO NOT MODIFY
│   │       ├── acl
│   │       ├── components
│   │       ├── helpers
│   │       └── store
│   │           ├── modules
│   │           └── plugins
│   ├── feathers - Exported feathers services
│   │   ├── hooks
│   │   └── services
│   │       ├── heartbeat
│   │       └── users
│   ├── filters - toTileCase
│   ├── mixins - PWA Install Mixin
│   ├── router - Vue Router folder
│   │   └── helpers
│   ├── store - Vuex store uses VuexPersistence
│   │   ├── modules
│   │   └── plugins
│   └── views - Router Views (See config/navItems.js)
│       └── Admin - For appuserroles
└── tests - Cypress e2e testing
    └── e2e
        ├── plugins - Resuables tests
        ├── specs - Test files
        └── support - User defined helpers
```
