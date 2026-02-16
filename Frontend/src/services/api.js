const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gadgetorymart-backend-1.onrender.com/api';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) return token;
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (resetToken, newPassword) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword }),
  }),
};

export const productsAPI = {
  getAll: () => apiRequest('/products'),
  getById: (id) => apiRequest(`/products/${id}`),
  create: (product) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
};

export const contactAPI = {
  create: (contactData) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
  submit: (contactData) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
  getAll: () => apiRequest('/contact'),
};

export const ordersAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  checkout: (orderData) => apiRequest('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  getUserOrders: () => apiRequest('/orders/my-orders'),
  getAllOrders: () => apiRequest('/orders/all'),
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

export const cartAPI = {
  getCart: () => apiRequest('/cart'),
  addToCart: (productData) => apiRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  removeFromCart: (productId) => apiRequest(`/cart/remove/${productId}`, {
    method: 'DELETE',
  }),
  updateQuantity: (productId, quantity) => apiRequest('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  }),
  clearCart: () => apiRequest('/cart/clear', {
    method: 'DELETE',
  }),
};

export const usersAPI = {
  getAll: () => apiRequest('/users'),
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export const reviewsAPI = {
  getProductReviews: (productId, sort = 'newest') => apiRequest(`/reviews/product/${productId}?sort=${sort}`),
  createReview: (reviewData) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  voteHelpful: (reviewId) => apiRequest(`/reviews/${reviewId}/vote`, {
    method: 'POST',
  }),
};