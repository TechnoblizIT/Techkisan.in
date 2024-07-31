import React from 'react';
import '../styles/ChangePassword.css'; // Importing CSS for styling
import logo from '../assets/logo1.png'; // Import the logo image with the correct path

const ChangePassword = () => {
  return (
    <div className="change-password">
      <div className="content">
        {/* Logo and Brand Information Section */}
        <div className="logo-section">
          <div className="logo-image">
            <img src={logo} alt="Techkisan Automation Logo" />
          </div>
          <h2 className="brand-tagline">Techkisan Automation</h2>
          <h3 className="brand-trust">Trusted Brand</h3>
          <h2 className="brand-tagline">The Service You Need!</h2>
        </div>
        
        {/* Change Password Section */}
        <div className="change-password-section">
          <h2 className="change-password-header">User Change Password</h2>
          <form className="change-password-form">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              placeholder="Enter current password"
              required
            />

            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              required
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              required
            />

            <button type="submit" className="change-password-button">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
