import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getDisasters = (tags = []) => {
  const params = new URLSearchParams();
  if (tags.length > 0) {
    params.append('tag', tags.join(','));
  }
  return API.get('/disasters', { params });
};

export const getDisaster = (id) => API.get(`/disasters/${id}`);
export const createDisaster = (disaster) => API.post('/disasters', disaster);
export const updateDisaster = (id, disaster) => API.put(`/disasters/${id}`, disaster);
export const deleteDisaster = (id) => API.delete(`/disasters/${id}`,{headers : {'x-user-id': 'user-2'}});

export const getReports = (disasterId) => API.get(`/disasters/${disasterId}/reports`);
export const createReport = (disasterId, report) => API.post(`/disasters/${disasterId}/reports`, report);

export const getResources = (disasterId) => API.get(`/disasters/${disasterId}/resources`);
export const createResource = (disasterId, resource) => API.post(`/disasters/${disasterId}/resources`, resource);
export const findNearbyResources = (location) => API.post('/resources/nearby', location);
