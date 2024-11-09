import React from 'react';
import '../styles/ManagerNavigation.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import APIEndpoints  from "./endPoints"

function ManagerNavigation({ activeSection, onNavigate }) {
  const navigate = useNavigate();
  const Endpoints= new APIEndpoints()

  

  const handleLogout = async () => {
    try {
      const token =localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
  
      
      localStorage.removeItem('token');

      navigate('/');

    } catch (err) {
      console.error('Error logging out:', err.response?.data?.message || 'Server error');
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = getCookie('token'); 
      if (!token) {
        console.error('Token not found');
        return;
      }
      navigate('/change-password');

    } catch (err) {
      console.error('Error logging out:', err.response?.data?.message || 'Server error');
    }
  };


  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (section) => {
    onNavigate(section);
    setIsOpen(false);
    setOpenDropdown('');
  };

  const toggleDropdown = (section) => {
    if (openDropdown === section) {
      setOpenDropdown('');
    } else {
      setOpenDropdown(section);
    }
  };

  return (
    <nav className="navigationbar">
      <div className="logo">Logo</div>
      <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li>
          <a
            href="#"
            className={activeSection === 'home' ? 'active' : ''}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </a>
        </li>
        <li className={`dropdown ${openDropdown === 'leaves' ? 'open' : ''}`}>
          <a
            href="#"
            className={activeSection === 'request' || activeSection === 'report' || activeSection === 'pending' ? 'active' : ''}
            onClick={() => toggleDropdown('leaves')}
          >
            Leaves
          </a>
          <div className="dropdown-content">
            <a href="#" onClick={() => handleLinkClick('request')}>Request</a>
            <a href="#" onClick={() => handleLinkClick('report')}>My Report</a>
            <a href="#" onClick={() => handleLinkClick('pending')}>Pending Leave</a>
          </div>
        </li>
        <li>
          <a
            href="#"
            className={activeSection === 'chat' ? 'active' : ''}
            onClick={() => handleLinkClick('chat')}
          >
            Chats With Teams
          </a>
        </li>
        <li className="dropdown-content">
          <a href="#" className="dropbtn">My Account <img src="assest/icons8-dropdown-30.png" width="10px" alt="" /></a>
          <div className="dropdown-content">
            <a href="#" onClick={handleChangePassword}>Change Password</a>
            <a href="#" style={{ color: "red" }} onClick={handleLogout}>Logout</a>
          </div>
        </li>
        
      </ul>
    </nav>
  );
}

export default ManagerNavigation;
