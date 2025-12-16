import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AdminOffers.css';

function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '', discount: '', description: '', validUntil: '', code: ''
  });

  useEffect(() => {
    const savedOffers = localStorage.getItem('adminOffers');
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adminOffers', JSON.stringify(offers));
  }, [offers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const offerData = { ...formData, discount: parseInt(formData.discount) };
    
    if (editingOffer) {
      setOffers(prev => prev.map(o => o.id === editingOffer.id ? { ...o, ...offerData } : o));
      setEditingOffer(null);
    } else {
      setOffers(prev => [...prev, { ...offerData, id: Date.now() }]);
    }
    
    setFormData({ title: '', discount: '', description: '', validUntil: '', code: '' });
    setShowForm(false);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      discount: offer.discount.toString(),
      description: offer.description,
      validUntil: offer.validUntil,
      code: offer.code
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(prev => prev.filter(o => o.id !== id));
    }
  };

  return (
    <div className={`admin-offers ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="admin-offers-header">
        <h1>Manage Offers</h1>
        <button 
          className="add-offer-btn"
          onClick={() => setShowForm(true)}
        >
          Add Offer
        </button>
      </div>

      {showForm && (
        <div className="offer-form-overlay">
          <div className="offer-form">
            <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Offer Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Discount Percentage"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Offer Code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
              <textarea
                placeholder="Offer Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <input
                type="date"
                placeholder="Valid Until"
                value={formData.validUntil}
                onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                required
              />
              <div className="form-buttons">
                <button type="submit">{editingOffer ? 'Update' : 'Add'} Offer</button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingOffer(null);
                  setFormData({ title: '', discount: '', description: '', validUntil: '', code: '' });
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="offers-grid">
        {offers.map(offer => (
          <div key={offer.id} className="admin-offer-card">
            <div className="offer-info">
              <h3>{offer.title}</h3>
              <p className="discount">{offer.discount}% OFF</p>
              <p className="code">Code: {offer.code}</p>
              <p className="description">{offer.description}</p>
              <p className="valid-until">Valid until: {offer.validUntil}</p>
            </div>
            <div className="offer-actions">
              <button onClick={() => handleEdit(offer)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(offer.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOffers;