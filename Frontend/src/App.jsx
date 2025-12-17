import React, { useState, useEffect } from 'react';
import AppRouter from "./routers/AppRouter";
import TestComponent from './components/TestComponent';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  console.log('🚀 App component rendering...');
  
  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      try {
        setIsReady(true);
      } catch (err) {
        setError(err);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Application Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    );
  }
  
  if (!isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading App...
      </div>
    );
  }
  
  try {
    return <AppRouter />;
  } catch (err) {
    console.error('❌ Error in App component:', err);
    return <TestComponent />;
  }
}

export default App;