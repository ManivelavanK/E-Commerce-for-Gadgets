const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'https://e-commerce-for-gadgets-1.onrender.com'}/api`;

const getAuthToken = () => {
  // Try both storage keys for compatibility
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

    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('🔗 API Request:', fullUrl);
    console.log('🌐 Backend URL:', import.meta.env.VITE_BACKEND_URL);
    
    const response = await fetch(fullUrl, config);
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('💥 API Request failed:', error);
    console.error('🔧 Check if backend URL is correct:', API_BASE_URL);
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