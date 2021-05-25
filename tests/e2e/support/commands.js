// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// https://login.microsoftonline.com/0662477d-fa0c-4556-a8f5-c3bc62aa0d9c/oauth2/v2.0/token
const tenantID = '0662477d-fa0c-4556-a8f5-c3bc62aa0d9c';
const client_id = 'c0cf535a-bb4d-4731-94fb-8a4165b1a124';
const url = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;
const client_secret = '81SCa2vDeOC.0fca4r~TN31g6wr_.vJNpa';
const azureResource = `api://${client_id}`;

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url,
    form: true,
    body: {
      grant_type: 'client_credentials',
      client_id,
      client_secret,
      resource: azureResource,
    },
  }).then((response) => {
    const Token = response.body.access_token;
    window.localStorage.setItem(`msal.idtoken`, Token);
    window.localStorage.setItem(`msal.client.info`, `{my_hard_coded_value}`);
  });
});
