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
a) Edit the "/MyAppName/src/index.json" file to add/change services
b) Copy a service folder from "/MyAppName/src/services/service1_v1" to "/MyAppName/src/services/service2_v1" 
   i) Change all filename prefixess in folder "/MyAppName/src/services/service2_v1" to service2_v1.x.js
c) Copy a model file from "/MyAppName/src/model/service1_v1.model.js" to "/MyAppName/src/model/service2_v1.model.js" 
   i) Modify model appropriate for your service (schema for full-CRUD or no schema for read-only)
d) Set the appropriate hooks for your new service.
   i) Always keep hooks related to auth and permissions.
e) npm run dev

```

## Lints and fixes files

```
npm run fix
```
