import React  from 'react';
import '../styles/AdminLoginPage.css'; 
import logo from '../assets/logo1.png'; 
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import APIEndpoints  from "./endPoints"
const AdminLoginPage = () => {
  const Endpoints= new APIEndpoints()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(Endpoints.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        console.log(data.message);
        navigate('/admin-dashboard');
      } else {
        
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };
  return (
    <div className="admin-login-page">
      <div className="content">
        <div className="logo-section">
          <div className="logo-image">
           
            <img src={logo} alt="Techkisan Automation Logo" />
          </div>
          <h2 className="brand-tagline">Techkisan Automation</h2>
          <h3 className="brand-trust">Trusted Brand</h3>
          <h2 className="brand-tagline">The Service You Need!</h2>
        </div>
        <div className="admin-login-section"> 
          <div className="admin-login-box"> 
            <a href="#" className="help-link">
              Need help?
            </a>
            <div className="login-header">
              <h2>Admin Login</h2>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="joe@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your Password"
                onChange={(e)=> setPassword(e.target.value)}
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
