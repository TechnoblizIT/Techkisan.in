import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ChangePassword.css';
import logo from '../assets/logo1.png';
import { useNavigate} from 'react-router-dom';
import APIEndpoints  from "./endPoints"
import { getByTitle } from '@testing-library/react';
const ChangePassword = () => {
  const Endpoints= new APIEndpoints()
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/")
       return;
    }

    try {
      const response = await axios.post(
        Endpoints.EMPLOYEE_CHANGEPASSWORD,
        { currentPassword, newPassword }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          },
        }
      );

      if (response.status === 200) {
        setSuccess('Password changed successfully');
        navigate("/employee-dashboard")
      } else {
        setError(response.data.message || 'Error changing password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="change-password">
      <div className="content">
        <div className="logo-section">
          <div className="logo-image">
            <img src={logo} alt="Techkisan Automation Logo" />
          </div>
          <h2 className="brand-tagline">Techkisan Automation</h2>
          <h3 className="brand-trust">Trusted Brand</h3>
          <h2 className="brand-tagline">The Service You Need!</h2>
        </div>
        <div className="change-password-section">
          <h2 className="change-password-header">User Change Password</h2>
          <form className="change-password-form" onSubmit={handleSubmit}>
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
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
