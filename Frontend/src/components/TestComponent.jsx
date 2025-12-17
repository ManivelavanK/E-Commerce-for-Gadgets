import React from 'react';

const TestComponent = () => {
  console.log('🧪 TestComponent rendering...');
  
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>Test Component Working!</h1>
      <p>If you see this, React is working correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestComponent;