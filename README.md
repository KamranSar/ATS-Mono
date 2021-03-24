## Project setup

### 1. git clone the admin-template repository as your app name

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

## Lints and fixes files

```
npm run fix
```

# database-template

> Template for developing Feathers API servers for the EIS Middle-Tier.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

   ```
   cd path/to/database-template
   npm install
   ```

3. Start your app

   ```
   npm start
   ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
