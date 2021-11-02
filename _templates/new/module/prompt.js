module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'Vuex modules must have a name.';
      }
      return true;
    },
  },
  {
    type: 'select',
    name: 'persisted',
    message: 'Pick a storage if persisted',
    choices: [
      { title: 'None' },
      { title: 'indexedDB' },
      { title: 'localStorage' },
      { title: 'cookies' },
      { title: 'sessionStorage' },
    ],
  },
  {
    type: 'toggle',
    name: 'dedicated',
    message: 'Create a dedicated folder for the module?',
    initial: false,
    inactive: 'no',
    active: 'yes',
  },
];
