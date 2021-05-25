// https://docs.cypress.io/api/introduction/api.html

/**
 * This assumes you are authenticated with Microsoft Azure
 * and you have a feathers backend running locally on :3000
 */
describe('Login', () => {
  it('Tries to login', () => {
    cy.login();

    // Check localstorage for our feathers token
    // Key is: Cypress.env('VUE_APP_NAME') (see cypress.json)
    // const VUE_APP_NAME = Cypress.env('VUE_APP_NAME');
    // const token = window.localStorage.get(VUE_APP_NAME);
    // if (token) {
    //   // If logged in then route should say "Welcome Home"
    //   cy.contains('h1', 'Welcome to Your Vue.js App');
    // } else {
    //   // Otherwise route should be /login
    //   // And there should be a Sign In button
    // }
    // cy.visit('/');
  });
});
