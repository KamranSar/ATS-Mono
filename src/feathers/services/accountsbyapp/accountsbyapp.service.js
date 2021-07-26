import feathersClient from '@/feathers/index.js';

const servicePath = 'api/auth/v1/accountsbyapp';
const service = feathersClient.service(servicePath);

// Feathers Service
export default service;
