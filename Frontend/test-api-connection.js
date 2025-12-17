// Simple test to verify API connection
const testAPI = async () => {
  const API_BASE_URL = 'https://mani-gadgets-backend.onrender.com/api';
  
  console.log('🔍 Testing API connection...');
  console.log('🌐 API Base URL:', API_BASE_URL);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('https://mani-gadgets-backend.onrender.com/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
    
    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log('✅ Products loaded:', Array.isArray(products) ? products.length : 'Invalid format');
      console.log('📦 First product:', products[0]?.name || 'No products');
    } else {
      console.log('❌ Products failed:', productsResponse.status, productsResponse.statusText);
      const errorText = await productsResponse.text();
      console.log('Error details:', errorText);
    }
    
    // Test auth endpoint
    console.log('\n3. Testing auth endpoint...');
    const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    console.log('Auth response status:', authResponse.status);
    if (authResponse.status === 400 || authResponse.status === 401) {
      console.log('✅ Auth endpoint is working (expected error for wrong credentials)');
    } else {
      console.log('❌ Auth endpoint issue:', authResponse.statusText);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.error('Error type:', error.name);
  }
};

// Run the test
testAPI();