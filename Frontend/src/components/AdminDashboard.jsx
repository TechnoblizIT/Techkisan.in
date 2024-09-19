// src/components/AdminDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarImage from "../assets/avtar.png";
import "../styles/AdminDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showNavList, setShowNavList] = useState(false);
  const [showTopNav, setShowTopNav] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [admindata, setAdmindata] = useState("");
  const [employeedata, setemployeedata] = useState("");
  const [employeeCount, setEmployeeCount] = useState();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = getCookie("token");

        if (!token) {
          navigate("/admin-login");
          return;
        }
        const decode =jwtDecode(token)
        if (decode.role!=="admin"){
          navigate("/admin-login")
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

    setShowNavList(true); if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  
    console.log(`Navigating to ${section}`);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
// -----------------------------------------------------------------------------------------------------------//
const [openMenu, setOpenMenu] = useState(null);

const toggleMenu = (index) => {
  setOpenMenu(openMenu === index ? null : index);
};

const handleSave = (event) => {
  event.preventDefault();
  // Logic to handle save action
  console.log('Superuser saved');
};

const handleQuit = () => {
  // Logic to handle quit action
  console.log('Quit action triggered');
}; 


  // State to track the active item
  const [activeItem, setActiveItem] = useState('add-account'); // No item is active initially

  // Handle click on a menu item
  const handleRightBarClick = (item) => {
    setActiveItem(item); // Set the clicked item as active
  };

// -----------------------------------------------------------------------------------------------------------//

  return (
    <div className="app">
      
      {/* Menu Button for Mobile */}
      <div className="menu-heading">
        <button className={`menu-btn ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <h2 className="dashboard-heading">Dashboard</h2>
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 id="dashboardHeading">Dashboard</h2>
        <div id="navList" className="nav-list">
          <ul>
            <li><a href="#hr" onClick={() => handleNavClick('hr')}>HR</a></li>
            <li><a href="#sales/purchase" onClick={() => handleNavClick('sales/purchase')}>Sales/Purchase</a></li>
            <li><a href="#accounting" onClick={() => handleNavClick('accounting')}>Accounting</a></li>
            <li><a href="">Company</a></li>
            <li><a href="">Tools</a></li>
            <li><a href="">Modules</a></li>
            <li><a href="">Add-Ons</a></li>
            <li><a href="">Setting</a></li>
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
              </Link> <br />
              <h2>Managers</h2>
              <Link className="add-new" to="/add-manager">
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
          {activeSection === "sales/purchase" && (
            <div id="sales/purchase" className="sales-purchase-section">
            <div className="right-buttons-container">
              <a href="#help-section" onClick={() => handleRightBarClick('help')} className="right-button-row">Help</a>
              <a href="#add-account-section" onClick={() => handleRightBarClick('add-account')} className="right-button-row">Add Account</a>
              <a href="#add-item-section" onClick={() => handleRightBarClick('add-item')} className="right-button-row">Add Item</a>
              <a href="#add-master-section" onClick={() => handleRightBarClick('add-master')} className="right-button-row">Add Master</a>
              <a href="#add-voucher-section" onClick={() => handleRightBarClick('add-voucher')} className="right-button-row">Add Voucher</a>
              <a href="#add-payment-section" onClick={() => handleRightBarClick('add-payment')} className="right-button-row">Add Payment</a>
              <a href="#add-receipt-section" onClick={() => handleRightBarClick('add-receipt')} className="right-button-row">Add Receipt</a>
              <a href="#add-journal-section" onClick={() => handleRightBarClick('add-journal')}className="right-button-row">Add Journal</a>
              <a href="#add-sales-section" onClick={() => handleRightBarClick('add-sales')} className="right-button-row">Add Sales</a>
              <a href="#add-purchase-section" onClick={() => handleRightBarClick('add-purchase')} className="right-button-row">Add Purchase</a>
              <a href="#balance-sheet-section" onClick={() => handleRightBarClick('balance-sheet')} className="right-button-row">Balance Sheet</a>
              <a href="#trial-balance-section" onClick={() => handleRightBarClick('trial-balance')} className="right-button-row">Trial Balance</a>
              <a href="#stock-status-section" onClick={() => handleRightBarClick('stock-status')} className="right-button-row">Stock Status</a>
              <a href="#acc-summary-section" onClick={() => handleRightBarClick('acc-summary')} className="right-button-row">Acc. Summary</a>
              <a href="#acc-ledger-section" onClick={() => handleRightBarClick('acc-ledger')} className="right-button-row">Acc. Ledger</a>
              <a href="#item-summary-section" onClick={() => handleRightBarClick('item-summary')} className="right-button-row">Item Summary</a>
              <a href="#item-ledger-section" onClick={() => handleRightBarClick('item-ledger')} className="right-button-row">Item Ledger</a>
              <a href="#gst-summary-section" onClick={() => handleRightBarClick('gst-summary')} className="right-button-row">GST Summary</a>
              <a href="#query-system-section" onClick={() => handleRightBarClick('query-system')} className="right-button-row">Query System</a>
              <a href="#switch-user-section" onClick={() => handleRightBarClick('switch-user')} className="right-button-row">Switch User</a>
              <a href="#configuration-section" onClick={() => handleRightBarClick('configuration')} className="right-button-row">Configuration</a>
              <a href="#lock-program-section" onClick={() => handleRightBarClick('lock-program')} className="right-button-row">Lock Program</a>
              <a href="#gst-portal-section" onClick={() => handleRightBarClick('gst-portal')} className="right-button-row">GST Portal</a>
              <a className="right-button-tax">
                <span>Tax Type:</span>
                <span className="gst-text">GST</span>
              </a>
            </div>
            <div className="sales-purchase-main-content">

              {activeItem === 'help' && (
                <div className="content-box">
                  <h2>Help</h2>
                  <p>This is the content for help</p>
                </div>
              )}

              {activeItem === 'add-account' && (
                <div className="content-box">
                  <div className="form-container">
                    <div className="header-section">
                      <h2>Create Company</h2>
                    </div>
                    <div className="merged-top-sections">
                      <div className="section-container">
                        <div className="form-row">
                          <label>Name:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Print Name:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Short Name:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Country:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>State:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>F.Y. Beginning from:</label>
                          <input type="date" />
                        </div>
                        <div className="form-row">
                          <label>Books Commencing from:</label>
                          <input type="date" />
                        </div>
                      </div>

                      <div className="section-container">
                        <div className="form-row">
                          <label>Address:</label>
                          <textarea rows={4} style={{fontSize: "14px"}} type="text" className="input-wide" />
                        </div>
                        <div className="form-row">
                          <label>CIN:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>IT PAN:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Telephone No.:</label>
                          <input rows type="text" />
                        </div>
                        <div className="form-row">
                          <label>E-Mail:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Fax:</label>
                          <input type="text" />
                        </div>
                      </div>
                    </div>

                    <div className="info-sections">
                      <div className="currency-section">
                        <h4>Currency Information</h4>
                        <div className="form-row">
                          <label>Currency Symbol:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Currency String:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Currency Sub-String:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Currency Font:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Currency Character:</label>
                          <input type="text" />
                        </div>
                      </div>

                      <div className="gst-vat-section">
                        <h4>GST/VAT Information</h4>
                        <div className="form-row">
                          <label>Enable GST/VAT:</label>
                          <input type="text" defaultValue="Y" />
                          <label className="aligned-label">Type:</label>
                          <input type="text" defaultValue="GST"  />
                        </div>
                        <div className="form-row">
                          <label>Enable Cess:</label>
                          <input type="text" defaultValue="N" />
                          <label className="aligned-label">Caption 1:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>Enable Add. Cess</label>
                          <input type="text"></input>
                          <label className="aligned-label">Caption 2:</label>
                          <input type="text" />
                        </div>
                        <div className="form-row">
                          <label>GSTN</label>
                          <input type="text"></input>
                        </div>
                        <div className="form-row">
                          <label>Type of Dealer:</label>
                          <input type="text" defaultValue="Regular" />
                        </div>
                        <div className="form-row">
                          <label>Default Tax Rate 1:</label>
                          <input type="number" defaultValue="0.00"  />
                          <label className="aligned-label">Default Tax Rate 2:</label>
                          <input type="number" defaultValue="0.00" />
                        </div>
                      </div>
                    </div>

                    <div className="copy-masters-section">
                      <h4>Copy Masters, Configuration, and Users From Existing Company</h4>
                      <div className="radio-group">
                        <div className="radio-option">
                          <input type="radio" id="notRequired" name="copyOptions" value="Not Required" defaultChecked />
                          <label htmlFor="notRequired">Not Required</label>
                        </div>
                        <div className="radio-option">
                          <input type="radio" id="copyMastersConfig" name="copyOptions" value="Copy Masters & Config" />
                          <label htmlFor="copyMastersConfig">Copy Masters & Config</label>
                        </div>
                        <div className="radio-option">
                          <input type="radio" id="copyMastersConfigUsers" name="copyOptions" value="Copy Masters, Config & Users" />
                          <label htmlFor="copyMastersConfigUsers">Copy Masters, Config & Users</label>
                        </div>
                      </div>
                    </div>

                    <div className="button-row right-buttons">
                        <button>Save</button>
                        <button>Quit</button>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'add-item' && (
                <div className="content-box">
                  <div className="item-master-container">
                    <h2 className="item-master-title">Add Item Master</h2>
                    <div className="main-container">
                      {/* Left Container */}
                      <div className="left-container">
                        <div className="grid-item item1">
                          <div className="row">
                            <label>Name:</label><input type="text" />
                          </div>
                          <div className="row">
                            <label>Alias:</label><input type="text" />
                          </div>
                          <div className="row">
                            <label>Print Name:</label><input type="text" />
                          </div>
                          <div className="row">
                            <label>Group:</label><input type="text" />
                          </div>
                        </div>

                        <div className="side-by-side">
                          <div className="grid-item item2">
                            <h4>Main Unit Details</h4>
                            <div className="row">
                              <label>Unit:</label><input type="text" />
                            </div>
                            <div className="row">
                              <label>Op. Stock (Qty.):</label><input type="text" defaultValue="0.00" />
                            </div>
                            <div className="row">
                              <label>Op. Stock (Value):</label><input type="text" />
                            </div>
                          </div>
                          <div className="grid-item item3">
                            <h4>Alternate Unit Details</h4>
                            <div className="row">
                              <label>Alternate Unit:</label><input type="text" />
                            </div>
                            <div className="row">
                              <label>Con. Factor:</label><input type="text" defaultValue="0.000" />
                            </div>
                            <div className="row">
                              <label>Con. Type:</label><input type="text" />
                            </div>
                            <div className="row">
                              <label>Op. Stock (Qty.):</label><input type="text" defaultValue="0.00" />
                            </div>
                          </div>
                        </div>

                        {/* Container with Visible Border around Invisible Containers */}
                        <div className="grid-item bordered-container">
                          <h4>Item Price Info</h4>
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Sales Price Applied On:</label><input type="text" defaultValue="Main Unit" />
                              </div>
                              <div className="row">
                                <label>Sales Price:</label><input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Purc. Price:</label><input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>M.R.P.:</label><input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Min. Sales Price:</label><input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Self-Val. Price:</label><input type="text" defaultValue="0.00" />
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Purc. Price Applied On:</label><input type="text" defaultValue="Main Unit" />
                              </div>
                              <div className="row">
                                <label>Sales Price:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Purc. Price:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Min. Sales Price:</label><input type="text" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid-item bordered-container">
                          <h4>Packaging Unit Details</h4>
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Packaging Unit:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Sales Price:</label><input type="text" />
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Con. Factor:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Purc. Price:</label><input type="text" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Next container */}
                        <div className="grid-item bordered-container">
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Default Unit For Sales:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Tax Category:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>HSN/SAC Code For GST:</label><input type="text" />
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Default Unit For Purc.:</label><input type="text" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Final container */}
                        <div className="grid-item bordered-container">
                          <h4>Item Tax Details</h4>
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Type:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Rate of Tax (CGST):</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Rate of Tax (SGST):</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Rate of Tax (IGST):</label><input type="text" />
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Tax on MRP:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Taxation Type:</label><input type="text" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Button Row in Left Container */}
                        <div className="button-row left-buttons">
                          <button>Notes</button>
                          <button>Opt. Fields</button>
                          <button>Multiple Alias</button>
                          <button>Item Image</button>
                        </div>
                      </div>

                      {/* Right Container */}
                      <div className="right-container">
                      <div className="grid-item bordered-container">
                          <h4>Discount & Markup Det.</h4>
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Sale Discount:</label><input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Sale Compound Disc:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Specify Sales Disc. Structure:</label><input type="text" defaultValue="N" />
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Purc. Discount:</label><input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Purc. Compound Disc.:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Specify Purc. Disc. Structure:</label><input type="text" defaultValue="N" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid-item bordered-container">
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Sale Markup:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Sale Comp. Markup:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Specify Sales Markup Structure:</label><input type="text" />
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Purc. Markup:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Purc. Comp. Markup:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Specify Purc. Markup Structure:</label><input type="text" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid-item item8">
                          <h4>Item Description</h4>
                            <textarea rows={4} type="text" className="input-wide" />
                        </div>
                        <div className="grid-item bordered-container">
                          <div className="invisible-containers">
                            <div className="grid-item">
                              <div className="row">
                                <label>Set Critical Level (Y/N):</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Maintain RG-23D:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Serial No.-wise Details:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>MRP-wise Details:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Exp./Mfg. Date Required:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Specify Sales Account:</label><input type="text" defaultValue="N"/>
                              </div>
                              <div className="row">
                                <label>Specify Purc Account:</label><input type="text" defaultValue="N"/>
                              </div>
                              <div className="row">
                                <label>Specify Default MC:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Freeze MC for Item:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Total No. of Authors (Max. 10):</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Pick Item Sizing Info. from Item Description:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Specify Default Vendor:</label><input type="text" defaultValue="N"/>
                              </div>
                              <div className="row">
                                <label>Don't Maintain Stock Balance:</label><input type="text" defaultValue="N"/>
                              </div>
                            </div>
                            <div className="grid-item">
                              <div className="row">
                                <label>Tariff Heading:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Parameterized Details:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Batch-wise Details:</label><input type="text" />
                              </div>
                              <div className="row">
                                <label>Expiry Days:</label><input type="text" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Button Row in Right Container */}
                        <div className="button-row right-buttons">
                          <button>Save</button>
                          <button>Quit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'add-master' && (
                <div className="content-box">
                  <div className="superuser-container1">
                    <h2>Company - New Company</h2>
                    <form onSubmit={handleSave}>
                      <div className="form-group1">
                        <label htmlFor="superuser-name">SuperUser Name:</label>
                        <input type="text" id="superuser-name" name="superuser-name" required />
                      </div>
                      <div className="form-group1">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                      </div>
                      <div className="form-group1">
                        <label htmlFor="recheck-password">Recheck Password:</label>
                        <input type="password" id="recheck-password" name="recheck-password" required />
                      </div>
                      <div className="button-group1">
                        <button type="submit" className="btn-save1">Save</button>
                        <button type="button" className="btn-quit1" onClick={handleQuit}>Quit</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeItem === 'add-voucher' && (
                <div className="content-box">
                  <h2>Add Voucher</h2>
                  <p>This is the content for Add Voucher</p>
                </div>
              )}

              {activeItem === 'add-payment' && (
                <div className="content-box">
                  <h2>Add Payment</h2>
                  <p>This is the content for Add Payment</p>
                </div>
              )}

              {activeItem === 'add-receipt' && (
                <div className="content-box">
                  <h2>Add-Reciept</h2>
                  <p>This is the content for Add-Reciept</p>
                </div>
              )}

              {activeItem === 'add-journal' && (
                <div className="content-box">
                  <h2>Add Journal</h2>
                  <p>This is the content for Add Journal</p>
                </div>
              )}

              {activeItem === 'add-sales' && (
                <div className="content-box">
                  <div className="sales-voucher-container">
                    <h2>Add Sales Voucher</h2>
                    <div className="header">
                      <div className="header-row">
                        <div className="aligned-item">
                          <label>Series:</label>
                          <input type="text" />
                        </div>
                        <div className="aligned-item">
                          <label>Main Date:</label>
                          <input type="date" />
                        </div>
                        <div className="aligned-item">
                          <label>Vch No.:</label>
                          <input type="text" />
                        </div>
                        <div className="aligned-item">
                          <label>Sale Type:</label>
                          <select>
                            <option>L/GST-5%</option>
                            <option>L/GST-12%</option>
                            <option>L/GST-18%</option>
                            <option>L/GST-28%</option>
                            <option>L/GST-Exempt</option>
                            <option>L/GST-ItemWise</option>
                            <option>L/GST-MultiRate</option>
                          </select>
                        </div>
                        <div className="aligned-item">
                          <label>Tax Type:</label>
                          <select>
                            <option value="GST">GST</option>
                            <option value="VAT">VAT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="party-section">
                      <label>Party:</label>
                      <input type="text" />
                      <label>Mat. Centre:</label>
                      <input type="text" />
                    </div>

                    <div className="narration-section">
                      <label>Narration:</label>
                      <input type="text" />
                    </div>

                    <div className="table-section">
                      <table>
                        <thead>
                          <tr>
                            <th>S.N.</th>
                            <th>Item</th>
                            <th>Qty.</th>
                            <th>Unit</th>
                            <th>Price (Rs.)</th>
                            <th>Amount (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(100)].map((_, index) => (
                            <tr key={index} className={index >= 10 ? "hidden-row" : ""}>
                              <td>{index + 1}</td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="totals-section">
                      <span>0.00 (Alt. Qty. = 0.00)</span>
                      <span>0.00</span>
                    </div>

                    <div className="gst-section">
                      <div className="gst-summary">
                        <h4>GST Summary</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Tax Rate</th>
                              <th>Taxable Amt.</th>
                              <th>GST</th>
                              <th>SGST</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="total-gst">
                          <label>Total:</label>
                          <input type="text"></input>
                          <input type="text"></input>
                        </div>
                      </div>
                      <div className="bill-sundry">
                        <h4>Bill Sundry</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Bill Sundry</th>
                              <th>@</th>
                              <th>Amount (Rs)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(100)].map((_, index) => (
                              <tr key={index} className={index >= 5 ? "hidden-row" : ""}>
                                <td>{index + 1}</td>
                                <td><input type="text" /></td>
                                <td><input type="text" /></td>
                                <td><input type="text" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="footer">
                      <button>Vch. Detail</button>
                      <button>Master Detail</button>
                      <button>Party Dash Board</button>
                      <button>Vch Image</button>
                      <button>Acc Image</button>
                      <button>Item Image</button>
                      <button>Update Discount</button>
                      <button>Check Scheme</button>
                      <button>Save</button>
                      <button>Quit</button>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'add-purchase' && (
                <div className="content-box">
                  <div className="purchase-voucher-container">
                    <h2>Add Purchase Voucher</h2>
                    <div className="header">
                      <div className="header-row">
                        <div className="aligned-item">
                          <label>Series:</label>
                          <input type="text" />
                        </div>
                        <div className="aligned-item">
                          <label>Main Date:</label>
                          <input type="date" />
                        </div>
                        <div className="aligned-item">
                          <label>Vch No.:</label>
                          <input type="text" />
                        </div>
                        <div className="aligned-item">
                          <label>Purc Type:</label>
                          <select>
                            <option>L/GST-5%</option>
                            <option>L/GST-12%</option>
                            <option>L/GST-18%</option>
                            <option>L/GST-28%</option>
                            <option>L/GST-Exempt</option>
                            <option>L/GST-ItemWise</option>
                            <option>L/GST-MultiRate</option>
                          </select>
                        </div>
                        <div className="aligned-item">
                          <label>Tax Type:</label>
                          <select>
                            <option value="GST">GST</option>
                            <option value="VAT">VAT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="party-section">
                      <label>Party:</label>
                      <input type="text" />
                      <label>Mat. Centre:</label>
                      <input type="text" />
                    </div>

                    <div className="narration-section">
                      <label>Narration:</label>
                      <input type="text" />
                    </div>

                    <div className="table-section">
                      <table>
                        <thead>
                          <tr>
                            <th>S.N.</th>
                            <th>Item</th>
                            <th>Qty.</th>
                            <th>Unit</th>
                            <th>Price (Rs.)</th>
                            <th>Amount (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(100)].map((_, index) => (
                            <tr key={index} className={index >= 10 ? "hidden-row" : ""}>
                              <td>{index + 1}</td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="totals-section">
                      <span>0.00 (Alt. Qty. = 0.00)</span>
                      <span>0.00</span>
                    </div>

                    <div className="gst-section">
                      <div className="gst-summary">
                        <h4>GST Summary</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Tax Rate</th>
                              <th>Taxable Amt.</th>
                              <th>GST</th>
                              <th>SGST</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                              <td><input type="text" /></td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="total-gst">
                          <label>Total:</label>
                          <input type="text"></input>
                          <input type="text"></input>
                        </div>
                      </div>
                      <div className="bill-sundry">
                        <h4>Bill Sundry</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Bill Sundry</th>
                              <th>@</th>
                              <th>Amount (Rs)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(100)].map((_, index) => (
                              <tr key={index} className={index >= 5 ? "hidden-row" : ""}>
                                <td>{index + 1}</td>
                                <td><input type="text" /></td>
                                <td><input type="text" /></td>
                                <td><input type="text" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="footer">
                      <button>Vch. Detail</button>
                      <button>Master Detail</button>
                      <button>Party Dash Board</button>
                      <button>Vch Image</button>
                      <button>Acc Image</button>
                      <button>Item Image</button>
                      <button>Update Discount</button>
                      <button>Check Scheme</button>
                      <button>Save</button>
                      <button>Quit</button>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'balance-sheet' && (
                <div className="content-box">
                  <h2>Balance Sheet</h2>
                  <p>This is the content for Balance Sheet</p>
                </div>
              )}

              {activeItem === 'trial-balance' && (
                <div className="content-box">
                  <h2>Trial Balance</h2>
                  <p>This is the content for Trial Balance</p>
                </div>
              )}

              {activeItem === 'stock-status' && (
                <div className="content-box">
                  <div className="stockstatus-container">
                    <h2>Stock Status</h2>
                    <div className="stockstatus-row">
                      <label>Report Date:</label>
                      <input type="date" />
                    </div>
                    <div className="stockstatus-row">
                      <label>Show Zero Stock Items?</label>
                      <input type="text" />
                    </div>
                    <div className="stockstatus-row">
                      <label>Show Parent Group?</label>
                      <input type="text" />
                    </div>
                    <div className="stockstatus-row">
                      <label>Report to be shown in:</label>
                      <select>
                        <option>Main Unit</option>
                        <option>Alt. Unit</option>
                        <option>Both Units</option>
                      </select>
                    </div>
                    <div className="stockstatus-row">
                      <label>Treat Main/Alt. Unit as Compound Unit?</label>
                      <input type="text" />
                    </div>
                    <div className="stockstatus-row">
                      <label>Item to be Shown by:</label>
                      <input type="text" />
                    </div>
                    <div className="stockstatus-row">
                      <label>Show Value of Items?</label>
                      <input type="text" />
                    </div>
                    <div className="stockstatus-row">
                      <label>Show MRP Also?</label>
                      <input type="text" />
                    </div>
                    <button className="stockstatus-button">OK</button>
                  </div>
                </div>
              )}

              {activeItem === 'acc-summary' && (
                <div className="content-box">
                  <div className="inventory-container">
                    <div className="inventory-header">
                      <h2>Inventory</h2>
                    </div>
                    <div className="i-merged-top-sections">
                      <div className="merged-inventory-container">
                        {/* Company information fields */}
                        <div className="z-inventory-row">
                          <label>Qty. Decimal Places:</label>
                          <div className="i-input-button">
                            <input type="text" />
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="z-inventory-row">
                          <label>Item-wise Discount Decimal Places:</label>
                          <div className="i-input-button">
                            <input type="text" />
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Packaging Unit of Items
                          </label>
                          <label className="i-extra-label-1">(eg. Pcs. & Box, Pcs. & Carton)</label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Alternate Unit of Items
                          </label>
                          <label className="i-extra-label-2">(eg. Pcs. & Kgs, Pcs. & Lts.)</label>
                          <button>Configure</button>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="z-inventory-row">
                          <label>Alt. Qty. Con. Decimal Places:</label>
                          <div className="i-input-button">
                            <input type="text" />
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Multi-Godown Inventory
                          </label>
                          <div className="i-input-button">
                            <button>Configure</button>
                            <button className="i-help-button-extra">?</button>
                          </div>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Manufacturing Features
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Sale Quotation
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable  Purchase Quotation
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Order Processing
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Sale/Purchase Challan
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Carry Pending Material Issued/Receipt to next F.Y.
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Pick Items Sizing Information from Item Description
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Seperate Stock Updation Date in Dual Vouchers
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Seperate Stock Valuation Method fo Items
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Accounting in Pure inventory Voucher
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Party-wise Item Codes
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Allow Sales Return in Sales Voucher
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Allow Purchas Return in Purchase Voucher
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Validate Sales Return with Original Sales
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Validate Purchase Return with Original Purchase
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Bill Sundry Narration
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Invoice Bar Code Printing (2D)
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="z-inventory-row">
                          <label>Item-wise Discount Type:</label>
                          <div className="i-input-button">
                            <input type="text" defaultValue="Simple Discount"/>
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                      </div>

                      <div className="merged-inventory-container">
                        <div className="z-inventory-row">
                          <label>Stock Value Method:</label>
                          <div className="i-input-button">
                            <input type="text" defaultValue="Weighted Average"/>
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="z-inventory-row">
                          <label>Tag Sale/Puc Acc. with:</label>
                          <div className="i-input-button">
                            <input type="text" defaultValue="Sale/Purc Type"/>
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="z-inventory-row">
                          <label>Tag Stock Acc. with:</label>
                          <div className="i-input-button">
                            <input type="text" defaultValue="Material Centre"/>
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Scheme
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Job Work
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Parameterized Detials
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Batch-wise Details
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Serial No.-wise Details
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            MRP-wise Details
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Skip Items Default Price during Voucher Modification
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Free Quantity in Vouchers
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Show Last Transactions during Sales
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                          Show Last Transactions during Purchase
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Allocate Additional Expenses Voucher-wise
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Allocate Expense/Purc. to Items
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Maintain Images/Notes with Masters/Vouchers
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Show Items Current Balance During Voucher Entry
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Maintain Drug Licence
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Date-wise Item Pricing
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Calculate Item Sale Price from Purchase Price
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Update Item Prices from Vouchers
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="inventory-row">
                        <label>
                          <input type="checkbox" className="i-checkbox" name="option1"></input>
                            Enable Packing Detials in Vouchers
                          </label>
                          <button className="i-help-button-extra">?</button>
                        </div>
                        <div className="zx-inventory-row">
                          <label>Do Not Maintain Stock Bal:</label>
                          <div className="i-input-button-double">
                          <input  rows type="text" defaultValue="At Item Level"/>
                          <button>Update Def. Value</button>
                          <button className="i-help-button">?</button>
                          </div>
                        </div>
                        <div className="z-inventory-row">
                          <label>Item-wise Markup Type:</label>
                          <div className="i-input-button">
                            <input type="text" defaultValue="Not Required"/>
                            <button className="i-help-button">?</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="button-row right-buttons">
                          <button>Save</button>
                      <button>Quit</button>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'acc-ledger' && (
                <div className="content-box">
                  <h2>Account Ledger</h2>
                  <p>This is the content for Account Ledger</p>
                </div>
              )}

              {activeItem === 'item-summary' && (
                <div className="content-box">
                  <div className="monthlysummery-container">
                    <h2>Inventory - Monthly Summery</h2>

                    <div className="item-section">
                      <label>Item:</label>
                      <input type="text" defaultValue="ITEM-1"/>
                      <label> ( Unit : BOX ) </label>
                    </div>
                    <div className="table-section-ms">
                      <table>
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Qty. In</th>
                            <th>Qty. Out</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>January</td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                          <tr>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                            <td><input type="text" /></td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Total</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'item-ledger' && (
                <div className="content-box">
                  <h2>Item Ledger</h2>
                  <p>This is the content for Item Ledger</p>
                </div>
              )}

              {activeItem === 'gst-summary' && (
                <div className="content-box">
                  <h2>GST Summary</h2>
                  <p>This is the content for GST Summary</p>
                </div>
              )}

              {activeItem === 'query-system' && (
                <div className="content-box">
                  <div className="sidebar-container">
                    <div className="chart-menu">
                      {[
                        { title: 'Purchase', subItems: ['Add', 'Modify', 'List'] },
                        { title: 'Sales Return (Cr. Note)', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Purchase Return (Dr. Note)', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Payment', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Receipt', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Journal', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Contra', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Dr. Note (w/o Items)', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Cr. Note (w/o Items)', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Stock Transfer', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Production', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Unassemble', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Stock Journal', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Mat. Issued to Party', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Mat. Rcvd. from Party', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'Physical Stock', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                        { title: 'GST Misc. Utilities', subItems: ['Option 1', 'Option 2', 'Option 3'] },
                      ].map((menu, index) => (
                        <div className="menu-item" key={index}>
                          <div className="menu-title" onClick={() => toggleMenu(menu.title)}>
                            <span className={`arrow ${openMenu === menu.title ? 'open' : ''}`}>&#9658;</span>
                            {menu.title}
                          </div>
                          {openMenu === menu.title && (
                            <ul className="sub-menu">
                              {menu.subItems.map((subItem, subIndex) => (
                                <li className="sub-item" key={subIndex}>{subItem}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      <div className="footer-buttons1">
                        <button className="footer-button1">Add To Favourites</button>
                        <button className="footer-button1">Create Shortcut</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItem === 'switch-user' && (
                <div className="content-box">
                  <h2>Switch User</h2>
                  <p>This is the content for Switch User</p>
                </div>
              )}

              {activeItem === 'configuration' && (
                <div className="content-box">
                  <h2>Configuration</h2>
                  <p>This is the content for Configuration</p>
                </div>
              )}

              {activeItem === 'lock-program' && (
                <div className="content-box">
                  <h2>Lock Program</h2>
                  <p>This is the content for Lock Program</p>
                </div>
              )}

              {activeItem === 'gst-portal' && (
                <div className="content-box">
                  <h2>GST Portal</h2>
                  <p>This is the content for GST Portal</p>
                </div>
              )}

            </div>
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
