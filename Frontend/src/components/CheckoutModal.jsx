import React from 'react';

function CheckoutModal({ 
  checkoutStep, 
  shippingAddress, 
  handleAddressChange, 
  paymentMethod, 
  setPaymentMethod, 
  cardDetails, 
  setCardDetails, 
  handleNextStep, 
  handlePrevStep, 
  handleCheckout, 
  setShowCheckout, 
  loading, 
  getTotalPrice 
}) {
  return (
    <div className="checkout-modal">
      <div className="checkout-form">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <div className="checkout-steps">
            <div className={`step ${checkoutStep >= 1 ? 'active' : ''}`}>1. Address</div>
            <div className={`step ${checkoutStep >= 2 ? 'active' : ''}`}>2. Payment</div>
            <div className={`step ${checkoutStep >= 3 ? 'active' : ''}`}>3. Review</div>
          </div>
        </div>

        {checkoutStep === 1 && (
          <div className="step-content">
            <h3>Shipping Address</h3>
            <div className="form-grid">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={shippingAddress.zipCode}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="step-buttons">
              <button type="button" onClick={() => setShowCheckout(false)}>Cancel</button>
              <button type="button" onClick={handleNextStep}>Next</button>
            </div>
          </div>
        )}

        {checkoutStep === 2 && (
          <div className="step-content">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <div className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} 
                   onClick={() => setPaymentMethod('card')}>
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <h4>Credit/Debit Card</h4>
                  <p>Visa, Mastercard, RuPay</p>
                </div>
              </div>
              <div className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`} 
                   onClick={() => setPaymentMethod('upi')}>
                <div className="payment-icon">📱</div>
                <div className="payment-info">
                  <h4>UPI Payment</h4>
                  <p>PhonePe, GPay, Paytm</p>
                </div>
              </div>
              <div className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`} 
                   onClick={() => setPaymentMethod('netbanking')}>
                <div className="payment-icon">🏦</div>
                <div className="payment-info">
                  <h4>Net Banking</h4>
                  <p>All major banks</p>
                </div>
              </div>
              <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} 
                   onClick={() => setPaymentMethod('cod')}>
                <div className="payment-icon">💰</div>
                <div className="payment-info">
                  <h4>Cash on Delivery</h4>
                  <p>Pay when you receive</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <h4>Card Details</h4>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  maxLength="16"
                />
                <div className="card-row">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                    maxLength="5"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    maxLength="3"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardDetails.cardholderName}
                  onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                />
              </div>
            )}

            <div className="step-buttons">
              <button type="button" onClick={handlePrevStep}>Back</button>
              <button type="button" onClick={handleNextStep} disabled={!paymentMethod}>Next</button>
            </div>
          </div>
        )}

        {checkoutStep === 3 && (
          <div className="step-content">
            <h3>Order Review</h3>
            <div className="order-summary">
              <div className="summary-section">
                <h4>Shipping Address</h4>
                <p>{shippingAddress.street}, {shippingAddress.city}</p>
                <p>{shippingAddress.state} - {shippingAddress.zipCode}</p>
              </div>
              <div className="summary-section">
                <h4>Payment Method</h4>
                <p>{paymentMethod === 'card' ? 'Credit/Debit Card' : 
                    paymentMethod === 'upi' ? 'UPI Payment' :
                    paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery'}</p>
              </div>
              <div className="summary-section">
                <h4>Order Total</h4>
                <p className="total-amount">₹{getTotalPrice().toLocaleString()}</p>
              </div>
            </div>
            <form onSubmit={handleCheckout}>
              <div className="step-buttons">
                <button type="button" onClick={handlePrevStep}>Back</button>
                <button type="submit" disabled={loading} className="place-order-btn">
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;