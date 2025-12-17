import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const TestComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API connection...');
        const data = await productsAPI.getAll();
        console.log('✅ Products loaded:', data);
        setProducts(data.slice(0, 3)); // Show first 3 products
        setError(null);
      } catch (err) {
        console.error('❌ API Test failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Testing API connection...</div>;
  
  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', margin: '20px' }}>
        <h3>❌ API Connection Failed</h3>
        <p><strong>Error:</strong> {error}</p>
        <p><strong>Backend URL:</strong> {import.meta.env.VITE_BACKEND_URL}</p>
        <p>Check console for more details.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid green', margin: '20px' }}>
      <h3>✅ API Connection Successful!</h3>
      <p><strong>Backend URL:</strong> {import.meta.env.VITE_BACKEND_URL}</p>
      <p><strong>Products loaded:</strong> {products.length}</p>
      <div>
        {products.map(product => (
          <div key={product._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <strong>{product.name}</strong> - ₹{product.price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestComponent;