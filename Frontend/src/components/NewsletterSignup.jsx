import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './NewsletterSignup.css';

const NewsletterSignup = ({ className = '', showTitle = true }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          source: 'website'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setEmail('');
        setName('');
      } else {
        setMessage(data.message || 'Failed to subscribe');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`newsletter-signup ${isDarkMode ? 'dark-theme' : 'light-theme'} ${className}`}>
      {showTitle && (
        <div className="newsletter-header">
          <h3>📧 Stay Updated!</h3>
          <p>Get the latest deals and product updates delivered to your inbox.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button 
            type="submit" 
            disabled={loading || !email}
            className="subscribe-btn"
          >
            {loading ? '...' : 'Subscribe'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`newsletter-message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <p className="newsletter-disclaimer">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSignup;