// src/components/NavigationBar.js
import React from 'react';
import '../styles/AdminDashboard.css';

function NavigationBar() {
  const toggleMenu = () => {
    document.querySelector('.nav-links').classList.toggle('active');
  };

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
            <a href="#">-</a>
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