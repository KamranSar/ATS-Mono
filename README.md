<img src="./public/img/logo.svg" alt="CDCR Logo" width="64" height="64" />

# vue-frontend-template

## What is this?

This repository is a starter project based on -

1. Vue CLI
2. Vuex + Pathify
3. Vuetify + standard layouts + dashboard
4. Feathers client for APIs
5. vue-browser-acl for ACLs

The objective is to keep things simple for simple client/server projects.

## Project setup

### Setup your local backend (_If you haven't already_)

Setting up a backend is easy.

TODO: Add the docker images for api-auth and api-admin

```sh
git clone https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/database-template
cd database-template
npm install
cd scripts
./start_db.sh
npm run dev
```

TODO: Add instructions for creating an cdcrAppID for test and adding api permissions for the app.

### Setup your local frontend

Now back in your `vue-frontend-template` folder

```sh
npm install
npm run serve
```

### Starting your development

Follow the HOWTO.md on starting your development.

### Compiles and minifies for production and PWA testing

```
npm run build
```
