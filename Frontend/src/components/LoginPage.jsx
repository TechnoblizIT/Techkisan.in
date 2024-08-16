import React, { useState } from 'react';
import '../styles/LoginPage.css'; 
import logo from '../assets/logo1.png'; 
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }), 
      });

      const data = await response.json();

      if (data.success) {
        console.log(data.message);
        navigate('/employee-dashboard');
      } else {
        
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <div className="content">
        <div className="logo-section">
          <div className="logo-image">
            <img src={logo} alt="Techkisan Automation Logo" />
          </div>
          <h2 className="brand-tagline">Techkisan Automation</h2>
          <h3 className="brand-trust">Trusted Brand</h3>
          <h2 className="brand-tagline">The Service You Need!</h2>
        </div>
        <div className="login-section">
          <div className="login-box">
            <a href="#" className="help-link">
              Need help?
            </a>
            <div className="login-header">
              <h2>Log in</h2>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label> 
              <input
                type="text"
                id="username"  
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="login-options">
                <a href="#" className="forgot-password">
                  Forgot password?
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

export default LoginPage;
