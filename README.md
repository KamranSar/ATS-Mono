# cdcr-client-template

## What is this?

This repository is a starter project based on -

1. Vue CLI
2. Vuex + Pathify
3. Vuetify + standard layouts + dashboard
4. Axios for using APIs

The objective is to keep things simple for simple client/server projects.

## Project setup

### Setup your local backend

If you haven't already... setting up a backend is easy.

```sh
git clone https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/api-router-template
cd api-router-template
npm install
cd /scripts
./start_db.sh
npm run dev
```

Now back in your `cdcr-client-template` folder

```
npm install
npm run serve
```

### Compiles and minifies for production and PWA testing

```
npm run build
```

## Directory Structure

Below outlines the default directory structure the template comes with:

```
.
├── App.vue
├── components - Vue components live here
│   ├── layouts
│   │   ├── navigation
│   │   │   ├── helpers
│   ├── mixins
│   │   └── Install.js - PWA Install Mixin
│   └── util
├── config - Application configuration folder
│   ├── private - Underlying template code, DO NOT MODIFY
├── router - Vue Router folder
│   ├── helpers
├── store - Vuex store uses VuexPersistence
│   ├── modules
│   ├── plugins
│   └── services
└── views - Router Views (See config/navItems.js)
```
