import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3030/api/ats',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const getResponses = async function (apiUrl, pageNo = 1, limit = 10) {
  const skip = (pageNo - 1) * limit;
  let actualUrl = apiUrl + `&$skip=${skip}&$limit=${limit}`;
  return apiClient.get(actualUrl);
};

// Turn off pagination
const getAllResponses = async function (apiUrl, limit = 10) {
  if (limit < 1) {
    limit = 1;
  }
  let pageNo = 1;
  let result = await getResponses(apiUrl, pageNo, limit);
  const resultArray = [];
  resultArray.push(...result.data.data);
  if (resultArray.length < result.data.total) {
    do {
      pageNo++;
      result = await getResponses(apiUrl, pageNo, limit);
      if (result.data.data.length) {
        resultArray.push(...result.data.data);
      }
    } while (resultArray.length < result.data.total);
  }
  result.data.data = [];
  result.data.data.push(...resultArray);
  result.data.total = resultArray.length;
  result.data.skip = 0;
  return result;
};

export default {
  async getArrivingOffenders() {
    return await getAllResponses('/offendertransfer?', 50);
  },
  async getDepartingOffenders() {
    return await getAllResponses('/offendertransfer?', 50);
  },
  // getRequestsByCDCR(id) {
  //   return apiClient.get('/request?$limit=50&$sort[dateReceived]=1&cdcrNumber=' + id);
  // },
  // getRequestByLog(id) {
  //   return apiClient.get('/request?$limit=50&logNum=' + id);
  // },
  // getReportRequests(query) {
  //   return apiClient.get(query);
  // },
  // getForm(id) {
  //   return apiClient.get('/request/' + id);
  // },
  // getPreviousRequests(id) {
  //   return apiClient.get('/request?offenderId=' + id);
  // },
  // async getPreviousIssues(id) {
  //   return await getAllResponses('issue?offenderId=' + id, 50);
  //   // return apiClient.get('issue?offenderId=' + id);
  // },
  // getPreviousAssignments(id) {
  //   return apiClient.get('assignments?logNum=' + id);
  // },
  // putForm(data) {
  //   return apiClient.put('/request/' + data._id, data);
  // },
  // createForm(data) {
  //   return apiClient.post('/request', data);
  // },
  // getLogNumber() {
  //   return apiClient.get('/newlognumber');
  // },
  // createAssignments(data) {
  //   return apiClient.post('/assignments', data);
  // },
  // putAssignments(data) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map((current) => this.putAssignments(current)));
  //   }
  //   return apiClient.put('/assignments/' + data._id, data);
  // },
  // createIssues(data) {
  //   return apiClient.post('/issue', data);
  // },
  // putIssues(data) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map((current) => this.putIssues(current)));
  //   }
  //   return apiClient.put('/issue/' + data._id, data);
  // },
  // deleteIssues(data) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map((current) => this.deleteIssues(current)));
  //   }
  //   return apiClient.delete('/issue/' + data._id);
  // },
  // deleteAssignments(data) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map((current) => this.deleteAssignments(current)));
  //   }
  //   return apiClient.delete('/assignments/' + data._id);
  // },
  async getUsers() {
    // return apiClient.get("/request");
    return await getAllResponses('/staffmember?', 50);
  },
  deleteUser(data) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.deleteUser(current)));
    }
    return apiClient.delete('/staffmember/' + data);
  },
  putUser(data) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.putUser(current)));
    }
    return apiClient.put('/staffmember/' + data._id, data);
  },
  createUser(data) {
    return apiClient.post('/staffmember', data);
  },
};
