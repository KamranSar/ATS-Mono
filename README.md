<img src="./public/favicon.ico" alt="CDCR Logo" width="64" height="64" />

# database-template

## What is this?

This repository is a starter project based on -

1. Feathers framework for creating real-time applications and REST APIs using JavaScript
2. feathersjs/authentication to implement zero-trust microservices
3. feathers-permissions for role and service method permissions
4. feathers-distributed to distribute your Feathers services as microservices
5. feathers-redis-cache to provide redis caching for APIs endpoints
6. feathers-knex which provides DB adapters for KnexJS and a query builder for Postgres, MSSQL, MySQL, and Oracle.
7. feathers-mongo / mongoose to provide a DB adapter and Mongoose schema to MongoDb 
8. several other pages...

The objective of this repo is to provide the flexibility for our devleopers to chose from one or many DB adapters.
#
## Project setup

### 1. Fork the database-template repo to your new project repo (`newServer`)
```
Do this step in Azure DevOps:

1. Click the ellipsis (...) button next to the Clone button and click on the Fork option.
2. Change the Repository Name field to the name of your new server (newServer).
3. Set the Project dropdown to the name of the DevOps project this new repo will be located in (YOUR-PROJECT).
4. Choose the "Only the default branch (main)" radio button option.
5. Click the Fork button.
   You will automatically be navigated to the new repo (newServer) file list.
```

### 3. Clone the new forked repo `newServer` locally in your Linux VM.

```
git clone https://cdcr@dev.azure.com/cdcr/YOUR-PROJECT/_git/newServer  newServer
```

### 4. In `/newServer` install dependencies, shared CDCR libraries, and create your .env file

```
cd newServer
npm install
```

### 5. Edit the .env and env.sample config file and change settings as needed

```
Set vars like APP_PORT, ORACLE_USER, ORACLE_PASSWORD, ORACLE_CONNSTR to the values you need.

```
### 6. Run your server

```
# This will compile and hot-reload the server when in development mode:

npm run dev
```
#
## Add and/or Change the service(s) you will publish:
```
cd newServer
# Start VS Code:
code .

1. Edit the "/newServer/package.json" file to change the server name and description.
2. Edit the "/newServer/src/service-config.js" file to set api/docs paths and to add/change services.
3. Copy a service folder from "/newServer/src/services/service1_v1" to "/newServer/src/services/service2_v1".
   - Change all filename prefixes in folder "/newServer/src/services/service2_v1" to service2_v1.x.js.
4. Copy a model file from "/newServer/src/model/service1_v1.model.js" to "/newServer/src/model/service2_v1.model.js".
   - Modify model appropriate for your service (schema for full-CRUD or no schema for read-only).
5. Set the appropriate hooks for your new service.
   - Always keep hooks related to auth and permissions.
6. npm run dev
```
#
## Before your first 'git push'

```
# Check that you don't already have it
git remote -v
# Add the upstream repo that this fork is based on:
git remote add upstream https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/database-template
# Fetch all changes from the "upstream" repo and the "main" branch:
git fetch upstream main
# Merge all changes from the "upstream" repo and the "main" branch with your local "newServer" repo AND supress all upstream history:
git merge --squash upstream/main

# Go to VS Code and the Git Source Control extension.
1. Check for and resolve any merge conflicts.
2. Stage the resolved conflicted files.
3. Commit your changes.
4. Push your changes to your "origin" repo and whatever branch you are working on.
5. You are now up-to-date with your parent repository.
```
#
## Lints and fixes files

```
npm run fix
```
