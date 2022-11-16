/**
 * This hook by the private component SignInWithMicrosoftButton.vue
 * This hook is called immediately after the user clicks the sign in button before actual authentication occurs.
 *
 * ! This hook MUST return true or false
 * true - Continue logging in
 * false - Cancel login
 *
 * https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
 */

export default async () => {
  // Add your custom onLogin logic here...
  // console.log('After logging in...');

  return true;
};
