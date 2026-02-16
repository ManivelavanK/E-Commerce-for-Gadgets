import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ products, onSearch, searchTerm }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 8)
        .map(product => ({
          id: product._id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          img: product.img
        }));
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        selectSuggestion(suggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const selectSuggestion = (suggestion) => {
    onSearch(suggestion.name);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search for products, brands, categories..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
              onClick={() => selectSuggestion(suggestion)}
            >
              <img src={suggestion.img} alt={suggestion.name} className="suggestion-image" />
              <div className="suggestion-info">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-details">
                  {suggestion.brand} • {suggestion.category} • ₹{suggestion.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;