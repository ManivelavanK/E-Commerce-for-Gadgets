// Test login endpoint specifically
const testLogin = async () => {
  const backendUrl = 'https://e-commerce-for-gadgets-1.onrender.com';
  
  console.log('🔍 Testing login endpoint...');
  
  try {
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123',
        role: 'user'
      }),
    });
    
    console.log('📡 Login Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📦 Raw response:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Login successful:', data);
    } else {
      console.log('❌ Login failed with status:', response.status);
      console.log('❌ Error response:', responseText);
    }
  } catch (error) {
    console.log('💥 Network error during login:', error.message);
    console.log('🔧 Full error:', error);
  }
};

testLogin();