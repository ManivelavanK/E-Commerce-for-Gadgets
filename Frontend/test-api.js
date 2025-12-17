// Test backend API connectivity
const testAPI = async () => {
  try {
    console.log('Testing backend API...');
    
    // Test basic connectivity
    const response = await fetch('https://mani-gadgets-backend.onrender.com/api/products');
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API working! Products:', data);
    } else {
      console.log('❌ API error:', response.statusText);
    }
  } catch (error) {
    console.error('💥 Network error:', error);
  }
};

testAPI();