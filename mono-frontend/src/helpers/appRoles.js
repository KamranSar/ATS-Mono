const SYS_ADMIN = {
  name: 'System Administrator',
  description:
    'Ability to read requests from all institutions. Access to all reports and provisioning of users statewide.',
  priority: 1, // Default: 1 - Highest priority level
};

const INST_ADMIN = {
  name: 'Institution Administrator',
  description:
    'Ability to read, update and create requests for their institution. Access to all reports and provisioning of users at their institution. Ability to change request received date for their institution.',
  priority: 2,
};

const INST_USER = {
  name: 'Institution User',
  description: 'Institution User has permission to create and update records.',
  priority: 20,
};

const GUEST = {
  name: 'Guest',
  description: 'Guest role has read or view access only.',
  priority: 99,
};

export { SYS_ADMIN, INST_ADMIN, INST_USER, GUEST };
