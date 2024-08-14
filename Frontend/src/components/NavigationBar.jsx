import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/AdminDashboard.css';

function NavigationBar() {
  const navigate = useNavigate();

  const toggleMenu = () => {
    document.querySelector('.nav-links').classList.toggle('active');
  };

  const handleLogout = async () => {
    try {
      const token = getCookie('token'); 
      if (!token) {
        console.error('Token not found');
        return;
      }

      await axios.get(
        'http://localhost:8000/employees/logout', 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

  

      navigate('/');

    } catch (err) {
      console.error('Error logging out:', err.response?.data?.message || 'Server error');
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  return (
    <nav>
      <div className="logo">Logo</div>
      <ul className="nav-links">
        <li><a href="#" className="active">Home</a></li>
        <li className="dropdown">
          <a href="#" className="dropbtn">Leaves <img src="assest/icons8-dropdown-30.png" width="10px" alt="" /></a>
          <div className="dropdown-content">
            <a href="#">-</a>
            <a href="#">-</a>
            <a href="#">-</a>
          </div>
        </li>
        <li className="dropdown">
          <a href="#" className="dropbtn">Self <img src="assest/icons8-dropdown-30.png" width="10px" alt="" /></a>
          <div className="dropdown-content">
            <a href="#">-</a>
            <a href="#">-</a>
            <a href="#">-</a>
          </div>
        </li>
        <li><a href="#">Job Vacancies</a></li>
        <li><a href="#">Attendance</a></li>
        <li className="dropdown">
          <a href="#" className="dropbtn">My Account <img src="assest/icons8-dropdown-30.png" width="10px" alt="" /></a>
          <div className="dropdown-content">
            <a href="#">-</a>
            <a href="#">-</a>
            <a href="#" style={{ color: "red" }} onClick={handleLogout}>Logout</a>
          </div>
        </li>
      </ul>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}

export default NavigationBar;
