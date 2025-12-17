// Test backend connectivity
const testBackend = async () => {
  const backendUrl = 'https://e-commerce-for-gadgets-1.onrender.com';
  
  console.log('🔍 Testing backend connectivity...');
  console.log('🌐 Backend URL:', backendUrl);
  
  try {
    // Test basic connectivity
    const response = await fetch(`${backendUrl}/api/products`);
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is accessible');
      console.log('📦 Sample data:', data);
    } else {
      console.log('❌ Backend returned error:', response.status);
      const errorText = await response.text();
      console.log('❌ Error details:', errorText);
    }
  } catch (error) {
    console.log('💥 Network error:', error.message);
    console.log('🔧 This suggests the backend server is not running or not accessible');
  }
};

testBackend();