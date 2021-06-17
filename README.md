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

```sh
git clone https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/database-template
cd database-template
npm install
./scripts/start_test_servers.sh # The first time, you'll want to be on VPN.****
npm run dev
```

### Setup your local frontend (BE SURE TO FORK NOT CLONE)

Now back in your `vue-frontend-template` folder

```sh
npm install
npm run serve
```

Add a remote called `upstream` that points to the forked repository.
You can then pull down the latest changes from the template like so.

```sh
git remote -v # Check that you don't already have it
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/vue-frontend-template
git fetch upstream main
git merge --squash upstream/main
```

### Starting your development

Follow the HOWTO.md on starting your development.

### Compiles and minifies for production

```
npm run build
```

### Test PWA Install

This will not work properly if you've set up a publicPath other than `'/'` _unless_ your app has already been registered for CDCR Apps in Azure.

1. `npm run build`
2. Download and and run `Web Server For Chrome`

   https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb

3. Running `Web Server For Chrome`, choose the `/dist` folder in your project.
