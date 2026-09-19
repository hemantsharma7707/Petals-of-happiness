import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  getAllAdmin: (params) => api.get('/admin/products', { params }),
};

export const orderService = {
  create: (data) => api.post('/orders', data),
  verifyPayment: (data) => api.post('/orders/verify', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  // Admin
  getAll: (params) => api.get('/admin/orders', { params }),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
};

export const reviewService = {
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getReviews: () => api.get('/admin/reviews'),
  updateReviewStatus: (id, status) => api.put(`/admin/reviews/${id}/status`, { isApproved: status }),
};
