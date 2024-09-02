// src/components/AdminDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarImage from "../assets/avtar.png";
import "../styles/AdminDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showNavList, setShowNavList] = useState(false);
  const [showTopNav, setShowTopNav] = useState(false);
  const [admindata, setAdmindata] = useState("");
  const [employeedata, setemployeedata] = useState("");
  const [employeeCount, setEmployeeCount] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = getCookie("token");

        if (!token) {
          navigate("/admin-login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/admin/admindata",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setemployeedata(data.employee);
          setEmployeeCount(data.employeeCount);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);

    if (section === "hr") {
      setShowTopNav(true);
    } else {
      setShowTopNav(false);
    }

    setShowNavList(true);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2 id="dashboardHeading">Dashboard</h2>
        <div id="navList" className="nav-list">
          <ul>
            <li>
              <a href="#hr" onClick={() => handleNavClick("hr")}>
                HR
              </a>
            </li>
            {/* <li>
              <a href="#crm" onClick={() => handleNavClick("crm")}>
                CRM
              </a>
            </li> */}
            <li>
              <a href="#sales" onClick={() => handleNavClick("sales")}>
                Sales
              </a>
            </li>
            <li>
              <a href="#purchase" onClick={() => handleNavClick("purchase")}>
                Purchase
                </a>
            </li>
            <li>
              <a
                href="#accounting"
                onClick={() => handleNavClick("accounting")}
              >
                Accouting
              </a>
            </li>
            <li>
              <a href="">Company</a>
            </li>
            <li>
              <a href="">Tools</a>
            </li>
            <li>
              <a href="">Modules</a>
            </li>
            <li>
              <a href="">Add-Ons</a>
            </li>
            <li>
              <a href="">Setting</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="main-content">
        {showTopNav && (
          <div className="top-navbar">
            <div className="title">
              <i class="fa-solid fa-users"></i> &nbsp;<h1>HR</h1>
            </div>
            <div className="nav-links">
              <a
                href="#overview"
                onClick={() => setActiveSection("overview")}
                className={activeSection === "overview" ? "active" : ""}
              >
                Overview
              </a>
              <a
                href="#employee"
                onClick={() => setActiveSection("employee")}
                className={activeSection === "employee" ? "active" : ""}
              >
                Employees
              </a>
              <a
                href="#department"
                onClick={() => setActiveSection("department")}
                className={activeSection === "department" ? "active" : ""}
              >
                Department
              </a>
              <a href="#">Designations</a>
              <a href="#">Announcement</a>
              <a href="#">Reports</a>
              <a href="#">Leave Management</a>
              <a href="#">Help</a>
            </div>
          </div>
        )}

        <div className="section-content">
          {activeSection === "overview" && (
            <div id="overview" className="overview-section">
              <h1>HR Management</h1>
              <div className="left-section">
                <div className="info-overview">
                  <div className="info-block">
                    <h1>{employeeCount ? employeeCount : "loading..."}</h1>
                    <h2>Employee</h2>
                    <Link className="view-link" to="#">
                      View Employees
                    </Link>
                  </div>
                  <div className="info-block">
                    <h1>6</h1>
                    <h2>Department</h2>
                    <Link className="view-link" to="#">
                      View Departments
                    </Link>
                  </div>
                  <div className="info-block">
                    <h1>13</h1>
                    <h2>Designation</h2>
                    <Link className="view-link" to="#">
                      View Designations
                    </Link>
                  </div>
                </div>
                {/* Latest Announcement Section */}
                <div className="latest-announcement">
                  <h3>
                    <i class="fa-solid fa-microphone"></i> Latest Announcement
                  </h3>
                  <hr />
                  <div className="announcement-content">
                    <h1>
                      Merry Christmas <span className="vertical-line"></span>
                      <span className="announcement-date">10-18-2018</span>
                    </h1>
                    <p>
                      The office will remain closed on 25th December, Tuesday.
                    </p>
                  </div>
                </div>
                {/* My Leave Calendar Section */}
                <div className="leave-calendar">
                  <h3>
                    <i class="fa-regular fa-calendar"></i> My Leave Calendar
                  </h3>
                  <hr />
                  <div className="calendar">
                    <p>Calendar Placeholder</p>
                  </div>
                </div>
              </div>
              <div className="right-section">
                {/* Birthday Buddies Block */}
                <div className="birthday-buddies">
                  <h3>
                    <i class="fa-solid fa-cake-candles"></i> Birthday Buddies
                  </h3>
                  <hr />
                  <p>Today's Birthday</p>
                  <div className="photo-upload">
                    <div className="photo-item">
                      <img src={avatarImage} alt="Avatar" />
                      <i className="fa-regular fa-envelope mail-icon"></i>
                    </div>
                    <div className="photo-item">
                      <img src={avatarImage} alt="Avatar" />
                      <i className="fa-regular fa-envelope mail-icon"></i>
                    </div>
                  </div>
                </div>
                {/* Who is Out Block */}
                <div className="who-is-out">
                  <h3>
                    <i className="fa-solid fa-paper-plane"></i> Who is out
                  </h3>
                  <hr />
                  <p>This Month</p>
                  <p>Next Month</p>
                </div>
                {/* Attendance Status Block */}
                <div className="attendance-status">
                  <h3>
                    <i class="fa-solid fa-chart-pie"></i> Attendance Status
                  </h3>
                  <hr />
                  <p className="no-data">Not enough data</p>
                  <div className="filter">
                    <span>Filter by:</span>
                    <select>
                      <option>This Month</option>
                      <option>Next Month</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Employee page */}
          {activeSection === "employee" && (
            <div id="employee" className="employee-section">
              <h2>Employees</h2>
              <Link className="add-new" to="/add-employee">
                Add New
              </Link>
            </div>
          )}
          {/* Department page */}
          {activeSection === "department" && (
            <div id="department" className="department-section">
              <p>This is the department page.</p>
            </div>
          )}
          {/* CRM section */}
          {activeSection === "crm" && (
            <div id="crm" className="crm-section">
              <h2>Sales Section</h2>
            </div>
          )}
          {/* Sales */}
          {activeSection === "sales" && (
            <div id="sales" className="sales-section">
              <h2>Sales</h2>
            </div>
          )}
          {/* purchase Section */}
          {activeSection==="purchase" &&(
            <div id="purchase" className="purchase-section">
              <h2>Purchase Section</h2>
            </div>
          )}
          
          {/* Accounting section */}
          {activeSection === "accounting" && (
            <div id="accounting" className="accounting-section">
              <h2>Purchase Section</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
