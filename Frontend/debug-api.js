// Debug script to test API connection
const API_BASE_URL = 'https://gadgetorymart-backend-1.onrender.com/api';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    // Test products endpoint
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    console.log('Products API status:', productsResponse.status);
    
    if (!productsResponse.ok) {
      throw new Error(`HTTP error! status: ${productsResponse.status}`);
    }
    
    const productsData = await productsResponse.json();
    console.log('Products count:', productsData.length);
    console.log('First product:', productsData[0]);
    
    return productsData;
  } catch (error) {
    console.error('API Test Error:', error);
    throw error;
  }
}

// Run the test
testAPI()
  .then(data => console.log('API test successful!', data.length, 'products found'))
  .catch(error => console.error('API test failed:', error));