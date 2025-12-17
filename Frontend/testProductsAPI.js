// Test script to verify frontend can reach backend API
const BACKEND_URL = 'https://mani-gadgets-backend.onrender.com';

const testAPI = async () => {
  console.log('🧪 Testing Backend API Connection...');
  console.log('🔗 Backend URL:', BACKEND_URL);
  
  try {
    // Test health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    console.log('Health Status:', healthResponse.status);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check:', healthData);
    }
    
    // Test products endpoint
    console.log('\n2️⃣ Testing products endpoint...');
    const productsResponse = await fetch(`${BACKEND_URL}/api/products`);
    console.log('Products Status:', productsResponse.status);
    console.log('Products Headers:', Object.fromEntries(productsResponse.headers.entries()));
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Products Response:', {
        count: productsData.length,
        firstProduct: productsData[0] || 'No products'
      });
    } else {
      const errorText = await productsResponse.text();
      console.log('❌ Products Error:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Network Error:', error.message);
  }
};

// Run in browser console or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  testAPI();
} else {
  // Node.js environment
  const fetch = require('node-fetch');
  testAPI();
}