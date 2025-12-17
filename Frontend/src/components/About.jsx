// ...existing code...
import "./About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-container enhanced-about">
      <header className="about-hero">
        <div className="about-hero-left">
          <h1 className="about-hero-title">About Mani’s Gadgets</h1>
          <p className="about-hero-sub">
            Your trusted online store for the latest tech. Premium products, fast delivery, and dedicated support — built for enthusiasts.
          </p>
          <div className="about-hero-ctas">
            <Link to="/products" className="cta-button primary">Shop Products</Link>
            <Link to="/contact" className="cta-button secondary">Contact Support</Link>
          </div>
        </div>

        <div className="about-hero-right">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900"
            alt="Mani's Gadgets"
          />
        </div>
      </header>

      <section className="about-stats">
        <div className="stat-card">
          <h3 className="stat-bold">50,000+</h3>
          <p className="stat-bold">Happy Customers</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-bold">200+</h3>
          <p className="stat-bold">Product Categories</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-bold">99.9%</h3>
          <p className="stat-bold">Customer Satisfaction</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-bold">24/7</h3>
          <p className="stat-bold">Support</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We aim to bring high-quality technology to everyone. From
            hand-selected gadgets to friendly expert support, Mani's Gadgets is
            committed to making tech shopping fast, safe and delightful.
          </p>
        </div>
        <div className="mission-cards">
          <div className="mission-card">
            <h4>Quality Assurance</h4>
            <p>All products are vetted and covered by manufacturer warranties.</p>
          </div>
          <div className="mission-card">
            <h4>Fast Delivery</h4>
            <p>Same-day processing and express shipping options available.</p>
          </div>
          <div className="mission-card">
            <h4>Easy Returns</h4>
            <p>Hassle-free returns and friendly customer care.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" alt="Priya" />
            <h4>Priya Sharma</h4>
            <p>Head of Operations</p>
          </div>
          <div className="team-member">
            <img src="https://imgs.search.brave.com/ou-96FglThMbMaDRiGh4KREik8Sxeya599XAgFo21gQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ4/MjE2OTk2MC9waG90/by9haXJwb3J0LXRy/YXZlbC1hbmQtcG9y/dHJhaXQtb2Ytd29t/YW4td2l0aC1wYXNz/cG9ydC1mbGlnaHQt/dGlja2V0LW9yLWlu/Zm9ybWF0aW9uLW9m/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz15RGktb2RMYmQ1/bEozRnYzeVFyb3Bp/eHUwM0tWQUJ0NkZO/amh6N01QcjRRPQ" alt="Amit" />
            <h4>Amit Patel</h4>
            <p>Head of Customer Success</p>
          </div>
          <div className="team-member">
            <img src="https://imgs.search.brave.com/WdzomtMrZC0nkhaSvPxb8ioZh91P30MU3HkmR_-gxMM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE0Lzk2LzExLzQx/LzM2MF9GXzE0OTYx/MTQxMTdfdjVYT1BD/MncyOHZzRWtoYk9E/NFJ1SzhXWWNWTm9R/U3UuanBn" alt="Mani" />
            <h4>Mani Kumar</h4>
            <p>Founder</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
// ...existing code...