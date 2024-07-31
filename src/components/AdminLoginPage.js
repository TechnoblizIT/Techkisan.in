import React from 'react';
import '../styles/AdminLoginPage.css'; // Importing CSS for styling
import logo from '../assets/logo1.png'; // Import the logo image with the correct path

const AdminLoginPage = () => {
  return (
    <div className="admin-login-page">
      <div className="content">
        <div className="logo-section">
          <div className="logo-image">
            {/* Display the logo */}
            <img src={logo} alt="Techkisan Automation Logo" />
          </div>
          <h2 className="brand-tagline">Techkisan Automation</h2>
          <h3 className="brand-trust">Trusted Brand</h3>
          <h2 className="brand-tagline">The Service You Need!</h2>
        </div>
        <div className="admin-login-section"> {/* Updated class name for admin login */}
          <div className="admin-login-box"> {/* Updated class name for admin login box */}
            <a href="#" className="help-link">
              Need help?
            </a>
            <div className="login-header">
              <h2>Admin Login</h2>
            </div>
            <form className="login-form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="joe@email.com"
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your Password"
                required
              />

              <div className="login-options">
                <a href="#" className="forgot-password">
                  forgot password?
                </a>
              </div>

              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
