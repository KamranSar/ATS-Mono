## Project setup

### 1. git clone the database-template repository as your app name

```
git clone https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier-Templates/_git/database-template  MyAppName
```

### 2. In `/MyAppName` install dependencies, shared CDCR libraries, and create .env file

```
cd MyAppName
npm install
```

### 3. Edit the .env and env.sample config file and change settings as needed

```
Set vars like APP_PORT to what you need

```
## Compiles and hot-reloads for development

```
npm run dev
```

### Via VS Code add/change the service(s) you will publish:

```
cd MyAppName
code .
a) Edit the "/MyAppName/package.json" file to change the server name.
b) Edit the "/MyAppName/src/index.json" file to add/change services and to change the server name.
c) Copy a service folder from "/MyAppName/src/services/service1_v1" to "/MyAppName/src/services/service2_v1" 
   i) Change all filename prefixess in folder "/MyAppName/src/services/service2_v1" to service2_v1.x.js
d) Copy a model file from "/MyAppName/src/model/service1_v1.model.js" to "/MyAppName/src/model/service2_v1.model.js" 
   i) Modify model appropriate for your service (schema for full-CRUD or no schema for read-only)
e) Set the appropriate hooks for your new service.
   i) Always keep hooks related to auth and permissions.
f) npm run dev
```

## Before your first 'git push'

```
# Go to DevOps and create your repo:
https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier/_git/MyAppName
# Then at the Linux shell, Initialize your local repo:
cd MyAppName
git init
# Remove previous remote "origin":
git remote remove origin
# Add new remote origin setting the path to the repository you created:
git remote add origin git clone https://cdcr@dev.azure.com/cdcr/CDCR-EIS-MiddleTier/_git/MyAppName
# Add all new files and Commit all local changes:
git add .
git commit -m 'Initial checkin'
# Push changes to new remote origin
git push --set-upstream  origin  main  --force 
```

## Lints and fixes files

```
npm run fix
```
