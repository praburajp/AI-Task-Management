import api from './api';

const getTasks = async (token, filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.sort) params.append('sort', filters.sort);
  
  const response = await api.get(`/tasks?${params.toString()}`);
  return response.data.tasks;
};

const getTask = async (token, id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.task;
};

const createTask = async (token, taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data.task;
};

const updateTask = async (token, id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data.task;
};

const deleteTask = async (token, id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

const getStats = async (token) => {
  const response = await api.get('/tasks/stats/dashboard');
  return response.data;
};

const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats
};

export default taskService;