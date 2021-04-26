//  see here for icons: http://materialdesignicons.com/

const anonymousItems = [
  {
    title: 'How it works?',
    to: '/#howitworks', // This is a Home page anchor tag, not a Router view
    icon: 'mdi-lightbulb',
  },
  {
    title: 'Features',
    to: '/#features', // This is a home page anchor tag, not a Router view
    icon: 'mdi-bug',
  },
  {
    title: 'Pricing',
    to: { name: 'Pricing' },
    icon: 'mdi-cash-multiple',
  },
  {
    title: 'Contact Us',
    to: { name: 'Contact Us' },
    icon: 'mdi-card-account-mail',
  },
  {
    title: 'Login',
    to: { name: 'login' },
    icon: 'mdi-login',
  },
  // {
  //   title: 'Signup',
  //   to: { name: 'signup' },
  //   icon: 'mdi-account-box-outline',
  // },
];
const userItems = [
  {
    icon: 'mdi-view-dashboard',
    title: 'Dashboard',
    to: { name: 'Dashboard' },
    color: 'success',
  },
  {
    icon: 'mdi-book-plus',
    title: 'Service Request',
    to: { name: 'ServiceReq' },
  },
];
const adminItems = [
  {
    icon: 'mdi-account-outline',
    title: 'Users',
    to: { name: 'users' },
  },
  {
    icon: 'mdi-printer',
    title: 'Export Templates',
    to: { name: 'templates' },
  },
];
const userToolbarItems = [
  {
    icon: 'mdi-folder-account',
    title: 'Account',
    to: { name: 'my-account' },
  },
  {
    icon: 'mdi-logout',
    title: 'Logout',
    to: { name: 'logout' },
  },
];

export { anonymousItems, userItems, adminItems, userToolbarItems };
