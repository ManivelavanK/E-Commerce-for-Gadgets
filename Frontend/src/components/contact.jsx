import { memo, useCallback, useState } from "react";
import { contactAPI } from "../services/api";
import "./contact.css";

const Contact = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const result = await contactAPI.submit(data);
      
      if (result.message) {
        alert("Request submitted — we'll get back to you soon!");
        e.target.reset();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="contact-container enhanced-contact">
      <div className="contact-grid">
        <div className="contact-form-card">
          <h1 className="contact-title">Contact Gadgetory Mart Support</h1>
          <p className="contact-subtitle">
            Have questions about a product, order, or delivery? We're here to help.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" className="contact-input" placeholder="Your Name" name="name" required />
              <input type="email" className="contact-input" placeholder="Your Email" name="email" required />
            </div>

            <div className="form-row">
              <input type="text" className="contact-input" placeholder="Order ID (Optional)" name="orderId" />
              <input type="text" className="contact-input" placeholder="Subject" name="subject" required />
            </div>

            <textarea className="contact-textarea" placeholder="Describe your issue or message..." name="message" required></textarea>

            <div className="form-actions">
              <button className="contact-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button type="reset" className="contact-btn alt">Reset</button>
            </div>
          </form>
        </div>

        <aside className="contact-info-card">
          <h3>📞 Customer Support</h3>
          <p className="support-line"><strong>Phone:</strong> +91 98765 43210</p>
          <p className="support-line"><strong>Email:</strong> support@gadgetorymart.com</p>
          <p className="support-line"><strong>Hours:</strong> 9 AM – 9 PM (All Days)</p>

          <div className="support-box">
            <h4>Live Chat</h4>
            <p>Click "Contact Support" in the site footer or send us an email — typical reply within 1 hour.</p>
          </div>

          <div className="address">
            <h4>Visit Us</h4>
            <p>Gadgetory Mart HQ — Bangalore, India</p>
          </div>
        </aside>
      </div>
    </div>
  );
});

export default Contact;
// ...existing code...