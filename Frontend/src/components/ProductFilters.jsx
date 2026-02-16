import React, { useState, useEffect } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ products, onFiltersChange, filters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Get unique brands and categories from products
  const brands = [...new Set(products.map(p => p.brand))].sort();
  const categories = [...new Set(products.map(p => p.category))].sort();
  
  // Get price range
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = [...localFilters.priceRange];
    newPriceRange[type === 'min' ? 0 : 1] = parseInt(value);
    handleFilterChange('priceRange', newPriceRange);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: 'all',
      brands: [],
      priceRange: [minPrice, maxPrice],
      rating: 0,
      sortBy: 'featured'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = 
    (localFilters.category !== 'all' ? 1 : 0) +
    localFilters.brands.length +
    (localFilters.rating > 0 ? 1 : 0) +
    (localFilters.priceRange[0] !== minPrice || localFilters.priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <div className="product-filters">
      <div className="filters-header">
        <button 
          className="filters-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔧 Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
        
        <select 
          value={localFilters.sortBy} 
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="sort-select"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
          <option value="popularity">Most Popular</option>
        </select>

        {activeFiltersCount > 0 && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          {/* Category Filter */}
          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={localFilters.category === 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                All Categories
              </label>
              {categories.map(category => (
                <label key={category}>
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={localFilters.category === category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <h4>Brand</h4>
            <div className="filter-options">
              {brands.map(brand => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    checked={localFilters.brands.includes(brand)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...localFilters.brands, brand]
                        : localFilters.brands.filter(b => b !== brand);
                      handleFilterChange('brands', newBrands);
                    }}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                min={minPrice}
                max={maxPrice}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                min={minPrice}
                max={maxPrice}
              />
            </div>
            <div className="price-range-slider">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="range-slider"
              />
              <div className="range-labels">
                <span>₹{minPrice.toLocaleString()}</span>
                <span>₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h4>Minimum Rating</h4>
            <div className="rating-filter">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating}>
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={localFilters.rating === rating}
                    onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  />
                  <span className="stars">
                    {'★'.repeat(rating)}{'☆'.repeat(5-rating)} & up
                  </span>
                </label>
              ))}
              <label>
                <input
                  type="radio"
                  name="rating"
                  value={0}
                  checked={localFilters.rating === 0}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                />
                All Ratings
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;