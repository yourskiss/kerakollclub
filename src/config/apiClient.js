import axios from 'axios';
import { setBearerToken } from './beararauth';

const apiURL = process.env.BASE_URL;

const apiClient = axios.create({
    baseURL: apiURL,
    headers: { 'authorization': 'Bearer '+ setBearerToken() },
});
const _post = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};
const _get = (url, config = {}) => {
  return apiClient.get(url, config);
};
const _delete = (url, config = {}) => {
  return apiClient.delete(url, config);
};
const _put = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, config);
};


 

export { _get, _delete, _put, _post };